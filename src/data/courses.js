const defaultLearningOptions = [
  {
    type: 'Online Live',
    labelAr: 'أونلاين لايف',
    description: 'Live online sessions with the instructor at scheduled times.',
  },
  {
    type: 'Online Recorded',
    labelAr: 'أونلاين فيديوهات مسجلة',
    description: 'Recorded course videos that students can watch anytime.',
  },
  {
    type: 'Offline',
    labelAr: 'أوفلاين - الدقي، القاهرة، مصر',
    description: 'In-person training at Dokki, Cairo, Egypt.',
  },
];

export const courses = [
  {
    id: 'video-editing',
    title: 'Video Editing',
    arabicTitle: 'مونتاج الفيديو',
    subtitle: 'Learn the rhythm behind every great edit.',
    creativeIntro:
      'From blank timeline to a piece worth showing. هنا هتعرف إزاي اللقطة تتحط في مكانها الصح فتخلق إحساس، مش مجرد cut.',
    duration: '8 Weeks',
    level: 'Beginner to Intermediate',
    tools: ['Adobe Premiere Pro', 'CapCut', 'DaVinci Resolve'],
    explore: [
      'Story flow, pacing, and edit rhythm that holds attention.',
      'Transition logic and when to keep cuts invisible.',
      'Sound layers that make the scene breathe.',
      'Color mood that supports the story, not distracts from it.',
    ],
    create: [
      'A cinematic short-form edit with intentional pacing.',
      'A polished before/after sequence with sound design.',
      'A signature cut style you can keep building on.',
    ],
    learn: [
      'Story flow, pacing, and edit rhythm that holds attention.',
      'Transition logic and when to keep cuts invisible.',
      'Sound layers that make the scene breathe.',
      'Color mood that supports the story, not distracts from it.',
    ],
    examples: [],
    learningOptions: defaultLearningOptions,
    facebookLink: 'https://facebook.com/',
    coverImage:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'motion-graphics',
    title: 'Motion Graphics',
    arabicTitle: 'موشن جرافيك',
    subtitle: 'Motion that feels alive.',
    creativeIntro:
      'اصنع صورة، حركة، وإحساس. في المسار ده هتحول العناصر الثابتة لمشاهد ليها نبض وشخصية.',
    duration: '10 Weeks',
    level: 'Beginner to Advanced',
    tools: ['Adobe After Effects', 'Adobe Illustrator', 'Cinema 4D (Basics)'],
    explore: [
      'Timing and spacing that make movement believable.',
      'Shape systems, masks, and compositions with visual balance.',
      'Typography in motion with clear intent.',
      'Camera moves and transitions that feel premium.',
    ],
    create: [
      'Branded motion scene with layered animation.',
      'Typography-driven visual sequence.',
      'A polished motion piece with your own style choices.',
    ],
    learn: [
      'Timing and spacing that make movement believable.',
      'Shape systems, masks, and compositions with visual balance.',
      'Typography in motion with clear intent.',
      'Camera moves and transitions that feel premium.',
    ],
    examples: [
      { title: 'Motion Graphics Example 01', src: '/videos/motion-graphics/V1.mp4', orientation: 'vertical' },
      { title: 'Motion Graphics Example 02', src: '/videos/motion-graphics/V2.mp4', orientation: 'vertical' },
      { title: 'Motion Graphics Example 03', src: '/videos/motion-graphics/V3.mp4', orientation: 'vertical' },
      { title: 'Motion Graphics Example 04', src: '/videos/motion-graphics/V4.mp4', orientation: 'vertical' },
      { title: 'Motion Graphics Example 05', src: '/videos/motion-graphics/V5.mp4', orientation: 'horizontal' },
      { title: 'Motion Graphics Example 06', src: '/videos/motion-graphics/V6.mp4', orientation: 'vertical' },
      { title: 'Motion Graphics Example 07', src: '/videos/motion-graphics/V7.mp4', orientation: 'vertical' },
    ],
    learningOptions: defaultLearningOptions,
    facebookLink: 'https://facebook.com/',
    coverImage:
      'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    arabicTitle: 'جرافيك ديزاين',
    subtitle: 'Design with intention, not decoration.',
    creativeIntro:
      'Make your visuals speak before anyone reads. هنا كل اختيار لون، خط، ومساحة له معنى.',
    duration: '9 Weeks',
    level: 'Beginner to Intermediate',
    tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma'],
    explore: [
      'Hierarchy, balance, and composition with clear visual intent.',
      'Brand systems and how to build a recognizable look.',
      'Typography decisions that carry personality.',
      'Layout refinement through critique and iteration.',
    ],
    create: [
      'A mini identity set with logo direction and brand assets.',
      'A premium social design set with one visual language.',
      'A styled case slide that showcases your decisions.',
    ],
    learn: [
      'Hierarchy, balance, and composition with clear visual intent.',
      'Brand systems and how to build a recognizable look.',
      'Typography decisions that carry personality.',
      'Layout refinement through critique and iteration.',
    ],
    examples: [],
    learningOptions: defaultLearningOptions,
    facebookLink: 'https://facebook.com/',
    coverImage:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'ai-video-making',
    title: 'AI Video Making',
    arabicTitle: 'صناعة الفيديو بالذكاء الاصطناعي',
    subtitle: 'Your ideas deserve better execution.',
    creativeIntro:
      'Where creative taste meets technical skill. Use AI to amplify your ideas, never to replace your vision.',
    duration: '6 Weeks',
    level: 'Beginner',
    tools: ['Runway', 'Pika', 'Midjourney', 'ChatGPT'],
    explore: [
      'Prompting for mood, style, and scene consistency.',
      'Idea-to-script flow with AI assistance.',
      'Blending generated visuals with manual finishing.',
      'Voice, subtitle, and polish passes for final output.',
    ],
    create: [
      'A short AI-assisted visual concept with clear direction.',
      'A mood-first video piece with style consistency.',
      'A finished clip that combines AI speed with human taste.',
    ],
    learn: [
      'Prompting for mood, style, and scene consistency.',
      'Idea-to-script flow with AI assistance.',
      'Blending generated visuals with manual finishing.',
      'Voice, subtitle, and polish passes for final output.',
    ],
    examples: [],
    learningOptions: defaultLearningOptions,
    facebookLink: 'https://facebook.com/',
    coverImage:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1920&q=80',
  },
];

export const getCourseById = (id) => courses.find((course) => course.id === id);
