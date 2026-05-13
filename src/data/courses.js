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
    examples: [
      {
        title: 'Video Editing Example 01',
        type: 'youtube',
        youtubeId: 'R_LwP0j5lvk',
        url: 'https://www.youtube.com/shorts/R_LwP0j5lvk',
        orientation: 'vertical',
      },
      {
        title: 'Video Editing Example 02',
        type: 'youtube',
        youtubeId: '5-lNURT-swg',
        url: 'https://www.youtube.com/shorts/5-lNURT-swg',
        orientation: 'vertical',
      },
      {
        title: 'Video Editing Example 03',
        type: 'youtube',
        youtubeId: 'cbb0cUMwZSc',
        url: 'https://www.youtube.com/shorts/cbb0cUMwZSc',
        orientation: 'vertical',
      },
      {
        title: 'Video Editing Example 04',
        type: 'youtube',
        youtubeId: '8FKGJ1X5dHI',
        url: 'https://www.youtube.com/watch?v=8FKGJ1X5dHI',
        orientation: 'horizontal',
      },
    ],
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
      {
        title: 'Motion Graphics Example 01',
        type: 'youtube',
        youtubeId: 'FhySkMnkAio',
        url: 'https://www.youtube.com/watch?v=FhySkMnkAio',
        orientation: 'vertical',
      },
      {
        title: 'Motion Graphics Example 02',
        type: 'youtube',
        youtubeId: 'fOaT0eDB6j4',
        url: 'https://www.youtube.com/shorts/fOaT0eDB6j4',
        orientation: 'vertical',
      },
      {
        title: 'Motion Graphics Example 03',
        type: 'youtube',
        youtubeId: 'o-LqiGr9NQM',
        url: 'https://www.youtube.com/shorts/o-LqiGr9NQM',
        orientation: 'vertical',
      },
      {
        title: 'Motion Graphics Example 04',
        type: 'youtube',
        youtubeId: 'WQ9s5l_ILos',
        url: 'https://www.youtube.com/shorts/WQ9s5l_ILos',
        orientation: 'vertical',
      },
      {
        title: 'Motion Graphics Example 05',
        type: 'youtube',
        youtubeId: '6b4RdG7dE9I',
        url: 'https://www.youtube.com/shorts/6b4RdG7dE9I',
        orientation: 'vertical',
      },
      {
        title: 'Motion Graphics Example 06',
        type: 'youtube',
        youtubeId: 'qayZah5wl4g',
        url: 'https://www.youtube.com/shorts/qayZah5wl4g',
        orientation: 'vertical',
      },
      {
        title: 'Motion Graphics Example 07',
        type: 'youtube',
        youtubeId: 'FpfuEtHMWJg',
        url: 'https://youtu.be/FpfuEtHMWJg',
        orientation: 'vertical',
      },
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
    examples: [
      {
        title: 'AI Video Making Example 01',
        type: 'youtube',
        youtubeId: 'j3yTArVHdtw',
        url: 'https://www.youtube.com/watch?v=j3yTArVHdtw',
        orientation: 'horizontal',
      },
      {
        title: 'AI Video Making Example 02',
        type: 'youtube',
        youtubeId: '0C6a798eoGA',
        url: 'https://www.youtube.com/watch?v=0C6a798eoGA',
        orientation: 'horizontal',
      },
      {
        title: 'AI Video Making Example 03',
        type: 'youtube',
        youtubeId: '78G-w64p7CE',
        url: 'https://www.youtube.com/watch?v=78G-w64p7CE',
        orientation: 'horizontal',
      },
    ],
    learningOptions: defaultLearningOptions,
    facebookLink: 'https://facebook.com/',
    coverImage:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1920&q=80',
  },
];

export const getCourseById = (id) => courses.find((course) => course.id === id);
