import { Destination, DestinationType } from '../types';

const MOCK_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'برج إيفل',
    slug: 'eiffel-tower',
    country: 'فرنسا',
    city: 'باريس',
    type: 'history',
    latitude: 48.8584,
    longitude: 2.2945,
    averageRating: 4.8,
    reviewsCount: 12450,
    myScore: 98,
    priceLevel: '$$',
    tags: ['رومانسي', 'معلم سياحي', 'تصوير'],
    hasBooking: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce7859?auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&q=80'],
    descriptionShort: 'الرمز العالمي لفرنسا وأحد أشهر المعالم في العالم.',
    descriptionFull: 'يقع برج إيفل في حديقة شامب دي مارس بالقرب من نهر السين. يبلغ ارتفاعه 324 متراً ويعتبر قبلة للسياح من جميع أنحاء العالم.',
    featured: true,
    reviews: [
      { id: 'r1', destinationId: '1', userId: 'u1', userName: 'أحمد علي', rating: 5, title: 'تجربة مذهلة', comment: 'المنظر من الأعلى خيالي، أنصح بالزيارة وقت الغروب.', date: '2023-10-15' }
    ]
  },
  {
    id: '2',
    name: 'البتراء',
    slug: 'petra',
    country: 'الأردن',
    city: 'وادي موسى',
    type: 'history',
    latitude: 30.3285,
    longitude: 35.4444,
    averageRating: 4.9,
    reviewsCount: 8500,
    myScore: 99,
    priceLevel: '$$',
    tags: ['تاريخ', 'آثار', 'مشى'],
    hasBooking: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579606038890-a2993d9b4395?auto=format&fit=crop&q=80',
    gallery: [],
    descriptionShort: 'المدينة الوردية المنحوتة في الصخر، إحدى عجائب الدنيا السبع.',
    descriptionFull: 'البتراء هي مدينة أثرية وتاريخية تقع في محافظة معان في جنوب المملكة الأردنية الهاشمية. تشتهر بعمارتها المنحوتة بالصخور ونظام قنوات جر المياه القديمة.',
    featured: true,
    reviews: []
  },
  {
    id: '3',
    name: 'جزر المالديف',
    slug: 'maldives',
    country: 'المالديف',
    city: 'ماليه',
    type: 'beach',
    latitude: 3.2028,
    longitude: 73.2207,
    averageRating: 4.7,
    reviewsCount: 3200,
    myScore: 95,
    priceLevel: '$$$',
    tags: ['استرخاء', 'بحر', 'شهر عسل'],
    hasBooking: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80',
    gallery: [],
    descriptionShort: 'جنة استوائية بمياه فيروزية وشواطئ رملية بيضاء.',
    descriptionFull: 'وجهة مثالية لمحبي الغوص والرياضات المائية والاسترخاء في المنتجعات الفاخرة فوق الماء.',
    featured: true,
    reviews: []
  },
  {
    id: '4',
    name: 'شيبويا كروسينغ',
    slug: 'shibuya',
    country: 'اليابان',
    city: 'طوكيو',
    type: 'urban',
    latitude: 35.6595,
    longitude: 139.7004,
    averageRating: 4.5,
    reviewsCount: 15000,
    myScore: 88,
    priceLevel: '$',
    tags: ['تسوق', 'ازدحام', 'ليلي'],
    hasBooking: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80',
    gallery: [],
    descriptionShort: 'التقاطع الأكثر ازدحاماً وشهرة في العالم في قلب طوكيو.',
    descriptionFull: 'منطقة تنبض بالحياة، مليئة بالمحلات التجارية والمطاعم وشاشات النيون الضخمة.',
    featured: false,
    reviews: []
  },
  {
    id: 'iq-1',
    name: 'مرقد الإمام علي (ع)',
    slug: 'imam-ali-shrine',
    country: 'العراق',
    city: 'النجف',
    type: 'history',
    latitude: 31.9957,
    longitude: 44.3148,
    averageRating: 5.0,
    reviewsCount: 50000,
    myScore: 100,
    priceLevel: '$',
    tags: ['ديني', 'تاريخ', 'عمارة إسلامية'],
    hasBooking: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1629904853716-f004135a970d?auto=format&fit=crop&q=80',
    gallery: [],
    descriptionShort: 'أحد أهم العتبات المقدسة والمعالم الدينية في العالم الإسلامي.',
    descriptionFull: 'يقع المرقد في قلب مدينة النجف القديمة، ويتميز بقبته الذهبية وعمارته الإسلامية الفريدة. يقصده الملايين سنوياً للزيارة والصلاة.',
    featured: true,
    reviews: []
  },
  {
    id: 'iq-2',
    name: 'نصب الشهيد',
    slug: 'al-shaheed-monument',
    country: 'العراق',
    city: 'بغداد',
    type: 'history',
    latitude: 33.3418,
    longitude: 44.4537,
    averageRating: 4.7,
    reviewsCount: 1500,
    myScore: 92,
    priceLevel: '$',
    tags: ['تاريخ', 'عمارة', 'نصب'],
    hasBooking: false,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Al-Shaheed_Monument.jpg/1200px-Al-Shaheed_Monument.jpg',
    gallery: [],
    descriptionShort: 'نصب تذكاري أيقوني في بغداد يرمز للتضحية والشهادة.',
    descriptionFull: 'تم تصميمه من قبل الفنان العراقي إسماعيل فتاح الترك، ويتكون من قبة عباسية مقسومة نصفين، ويقع وسط بحيرة صناعية.',
    featured: false,
    reviews: []
  },
  {
    id: 'iq-3',
    name: 'العتبة الحسينية المقدسة',
    slug: 'imam-hussain-shrine',
    country: 'العراق',
    city: 'كربلاء',
    type: 'history',
    latitude: 32.6164,
    longitude: 44.0324,
    averageRating: 5.0,
    reviewsCount: 60000,
    myScore: 100,
    priceLevel: '$',
    tags: ['ديني', 'تاريخ', 'روحاني'],
    hasBooking: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1688981176786-56f571854571?auto=format&fit=crop&q=80',
    gallery: [],
    descriptionShort: 'مرقد الإمام الحسين بن علي (ع)، قلب كربلاء النابض.',
    descriptionFull: 'مركز روحي عالمي، يتميز بقبة ذهبية ومآذن شاهقة، ويشهد أكبر التجمعات البشرية في العالم خلال الزيارات المليونية.',
    featured: true,
    reviews: []
  },
  {
    id: 'iq-4',
    name: 'قلعة أربيل',
    slug: 'erbil-citadel',
    country: 'العراق',
    city: 'أربيل',
    type: 'history',
    latitude: 36.1901,
    longitude: 44.0089,
    averageRating: 4.6,
    reviewsCount: 3000,
    myScore: 90,
    priceLevel: '$',
    tags: ['آثار', 'تراث', 'يونسكو'],
    hasBooking: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1631866790069-e74c8983373e?auto=format&fit=crop&q=80',
    gallery: [],
    descriptionShort: 'أقدم مدينة مأهولة باستمرار في العالم، موقع تراث عالمي.',
    descriptionFull: 'تتوسط مدينة أربيل وتقع على تل بيضوي الشكل، وتضم منازل تراثية ومتاحف ومتاجر للحرف اليدوية.',
    featured: false,
    reviews: []
  },
  {
    id: 'iq-5',
    name: 'زقورة أور',
    slug: 'ziggurat-of-ur',
    country: 'العراق',
    city: 'الناصرية',
    type: 'history',
    latitude: 30.9624,
    longitude: 46.1031,
    averageRating: 4.8,
    reviewsCount: 1200,
    myScore: 94,
    priceLevel: '$',
    tags: ['سومري', 'آثار', 'تاريخ قديم'],
    hasBooking: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1664287888037-077c5b0e3606?auto=format&fit=crop&q=80',
    gallery: [],
    descriptionShort: 'واحدة من أقدم المعابد المدرجة في العالم، تعود للحضارة السومرية.',
    descriptionFull: 'تقع بالقرب من مدينة الناصرية، وكانت مركزاً دينياً هاماً في مدينة أور القديمة، مسقط رأس النبي إبراهيم (ع).',
    featured: false,
    reviews: []
  },
  {
    id: 'iq-6',
    name: 'كورنيش شط العرب',
    slug: 'shatt-al-arab-corniche',
    country: 'العراق',
    city: 'البصرة',
    type: 'nature',
    latitude: 30.5081,
    longitude: 47.8132,
    averageRating: 4.5,
    reviewsCount: 4000,
    myScore: 89,
    priceLevel: '$',
    tags: ['نهر', 'طبيعة', 'نزهة'],
    hasBooking: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544734660-824e4d333029?auto=format&fit=crop&q=80',
    gallery: [],
    descriptionShort: 'ملتقى نهري دجلة والفرات، ومتنفس أهل البصرة.',
    descriptionFull: 'يوفر إطلالات ساحرة على النهر والسفن العابرة، ويضم العديد من المطاعم والمقاهي والحدائق.',
    featured: false,
    reviews: []
  }
];

interface GetDestinationsParams {
  search?: string;
  type?: DestinationType | 'all';
  city?: string;
}

export const getDestinations = async (params: GetDestinationsParams): Promise<Destination[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let results = [...MOCK_DESTINATIONS];

  if (params) {
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      results = results.filter(d => 
        d.name.toLowerCase().includes(searchLower) ||
        d.city.toLowerCase().includes(searchLower) ||
        d.country.toLowerCase().includes(searchLower)
      );
    }

    if (params.type && params.type !== 'all') {
      results = results.filter(d => d.type === params.type);
    }

    if (params.city && params.city !== 'all') {
      results = results.filter(d => d.city === params.city);
    }
  }

  return results;
};

export const bookDestination = async (destinationId: string, bookingDetails: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Booking confirmed:', { destinationId, ...bookingDetails });
  return { success: true, bookingId: 'bk_' + Date.now() };
};