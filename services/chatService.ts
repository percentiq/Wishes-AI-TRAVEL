

import { supabase } from '../lib/supabaseClient';
import { ChatSession, Message, Role, BookingItem } from '../types';

export const createChatSession = async (userId: string, firstMessage: string): Promise<ChatSession | null> => {
  // Determine a title from the first message (truncate if too long)
  const title = firstMessage.length > 40 ? firstMessage.substring(0, 40) + '...' : firstMessage;

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, title })
    .select()
    .single();

  if (error) {
    console.error('Error creating chat session:', error);
    return null;
  }
  return data;
};

export const getUserSessions = async (userId: string): Promise<ChatSession[]> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
  return data;
};

export const deleteChatSession = async (sessionId: string) => {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

export const getSessionMessages = async (sessionId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  // Map DB fields to Message type and parse offers
  return data.map((msg: any) => {
      let text = msg.text;
      let offer: BookingItem | undefined;

      // Attempt to extract JSON offer from the text (saved in DB with JSON block)
      const jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
          try {
              const offerData = JSON.parse(jsonMatch[1]);
              if (offerData.type && offerData.title && offerData.price) {
                  offer = {
                      id: `offer_${msg.id}`, // Stable ID based on message ID
                      ...offerData
                  };
                  // Clean the text shown to user
                  text = text.replace(jsonMatch[0], '').trim();
              }
          } catch (e) {
              // Ignore parsing errors, leave text as is
          }
      }

      return {
        id: msg.id,
        role: msg.role as Role,
        text: text,
        createdAt: msg.created_at,
        offer: offer
      };
  });
};

export const saveMessage = async (sessionId: string, role: Role, text: string) => {
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role,
      text
    });

  if (error) {
    console.error('Error saving message:', error);
  }
};

// --- Booking Operations ---

export const createBooking = async (sessionId: string, booking: Omit<BookingItem, 'id'>): Promise<BookingItem | null> => {
  // Ensure price is a string
  const priceStr = typeof booking.price === 'string' ? booking.price : String(booking.price);
  
  // Prepare details with status
  const bookingDetails = {
      ...booking.details,
      status: 'pending' 
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      session_id: sessionId,
      type: booking.type,
      title: booking.title,
      description: booking.description,
      price: priceStr,
      currency: booking.currency,
      details: bookingDetails,
      status: 'pending' // Set the explicit status column
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }

  return {
    id: data.id,
    type: data.type,
    title: data.title,
    description: data.description,
    price: data.price,
    currency: data.currency,
    details: data.details,
    status: data.status || 'pending'
  };
};

export const getSessionBookings = async (sessionId: string): Promise<BookingItem[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data.map((b: any) => ({
    id: b.id,
    type: b.type,
    title: b.title,
    description: b.description,
    price: b.price,
    currency: b.currency,
    details: b.details,
    status: b.status || b.details?.status || 'pending'
  }));
};

export const deleteBooking = async (bookingId: string) => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

// Confirm bookings: update status in both column and details, and record payment
export const confirmSessionBookings = async (sessionId: string, amount: number) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 1. Insert Payment Record
    const { error: paymentError } = await supabase.from('payments').insert({
        user_id: user.id,
        session_id: sessionId,
        amount: amount,
        currency: 'USD', // Should match booking currency ideally, assuming USD for now or taking from first booking
        status: 'completed'
    });

    if (paymentError) {
        console.error('Error creating payment record:', paymentError);
        throw paymentError;
    }

    // 2. Fetch current bookings to get their details
    const { data: bookings, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('session_id', sessionId);

    if (fetchError || !bookings) {
        console.error('Error fetching bookings for confirmation:', fetchError);
        throw fetchError;
    }

    // 3. Update each booking that is pending
    const updates = bookings.map(async (b: any) => {
        if (b.status !== 'confirmed') {
            const newDetails = { ...b.details, status: 'confirmed' };
            const { error: updateError } = await supabase
                .from('bookings')
                .update({ 
                    status: 'confirmed', // Update explicit column
                    details: newDetails 
                })
                .eq('id', b.id);
            
            if (updateError) console.error('Error updating booking status:', updateError);
            
            // Insert initial tracking record
            if (!updateError) {
                 await supabase.from('trip_updates').insert({
                     booking_id: b.id,
                     status_text: 'تم تأكيد الحجز',
                     description: 'تم استلام المبلغ وتأكيد الحجز بنجاح. سنوافيك بالتفاصيل قريباً.',
                     icon: 'check'
                 });
            }
        }
    });

    await Promise.all(updates);
};

export const getUserConfirmedBookings = async (userId: string): Promise<BookingItem[]> => {
    // 1. Get all user sessions
    const { data: sessions, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', userId);
    
    if (sessionError) {
        console.error("Error fetching user sessions for bookings", sessionError);
        return [];
    }

    if (!sessions || sessions.length === 0) return [];

    const sessionIds = sessions.map(s => s.id);

    // 2. Get confirmed bookings using the explicit status column
    const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .in('session_id', sessionIds)
        .eq('status', 'confirmed') // Use explicit column filter
        .order('created_at', { ascending: false });

    if (bookingError) {
        console.error("Error fetching confirmed bookings", bookingError);
        return [];
    }

    return bookings.map((b: any) => ({
        id: b.id,
        type: b.type,
        title: b.title,
        description: b.description,
        price: b.price,
        currency: b.currency,
        details: b.details,
        status: b.status || 'confirmed',
        created_at: b.created_at
    }));
};
