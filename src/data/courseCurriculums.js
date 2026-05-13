import {
  motionGraphicsCurriculumModules,
  motionGraphicsCurriculumStats,
} from './motionGraphicsCurriculum.js';

export const courseCurriculums = {
  'video-editing': {
    description:
      'A practical editing path that builds timeline confidence, storytelling rhythm, sound polish, color finishing, and a final portfolio-ready edit.',
    stats: [
      { label: '6 Modules', key: 'modules' },
      { label: '30 Lessons', key: 'lessons' },
      { label: '10+ Hours', key: 'hours' },
      { label: 'Portfolio Project', key: 'project' },
    ],
    modules: [
      {
        id: 've01',
        number: '01',
        title: 'Editing Foundations',
        description:
          'Build a clean timeline workflow and understand how professional edits are organized from the first cut.',
        lessonCount: 5,
        durationLabel: '1h 20m',
        lessons: [
          'Editing workflow overview',
          'Project setup and media organization',
          'Timeline basics and trimming tools',
          'Cutting for clarity',
          'Export settings for review',
        ],
      },
      {
        id: 've02',
        number: '02',
        title: 'Storytelling & Rhythm',
        description:
          'Learn how pacing, shot order, and timing shape emotion and hold attention.',
        lessonCount: 5,
        durationLabel: '1h 45m',
        lessons: [
          'Finding the story in raw footage',
          'Pacing for short-form edits',
          'Invisible cuts and motivated transitions',
          'B-roll structure',
          'Building tension and release',
        ],
      },
      {
        id: 've03',
        number: '03',
        title: 'Audio & Sound Design',
        description:
          'Use music, dialogue, ambience, and effects to make edits feel intentional and finished.',
        lessonCount: 5,
        durationLabel: '1h 30m',
        lessons: [
          'Cleaning dialogue',
          'Music selection and timing',
          'Sound effects layers',
          'Audio transitions',
          'Final mix basics',
        ],
      },
      {
        id: 've04',
        number: '04',
        title: 'Color & Finishing',
        description:
          'Create a polished visual mood with correction, grading, and consistent finishing passes.',
        lessonCount: 5,
        durationLabel: '1h 40m',
        lessons: [
          'Color correction basics',
          'Matching shots',
          'Creating mood with grade',
          'Titles and simple graphics',
          'Final polish checklist',
        ],
      },
      {
        id: 've05',
        number: '05',
        title: 'Social Media Editing Workflow',
        description:
          'Adapt edits for reels, shorts, ads, captions, hooks, and platform-specific delivery.',
        lessonCount: 5,
        durationLabel: '1h 45m',
        lessons: [
          'Hook-first editing',
          'Vertical timeline setup',
          'Captions and safe areas',
          'Fast feedback revisions',
          'Exporting for each platform',
        ],
      },
      {
        id: 've06',
        number: '06',
        title: 'Portfolio Project',
        description:
          'Create one complete edit with story, sound, color, and a presentation-ready final export.',
        lessonCount: 5,
        durationLabel: '2h',
        lessons: [
          'Project brief and reference board',
          'Assembly cut',
          'Sound and pacing pass',
          'Color and title pass',
          'Final export and case presentation',
        ],
      },
    ],
  },
  'motion-graphics': {
    description:
      'Step-by-step lessons designed to take you from basics to professional motion graphics workflows.',
    stats: motionGraphicsCurriculumStats,
    modules: motionGraphicsCurriculumModules,
  },
  'graphic-design': {
    description:
      'A structured design path focused on visual systems, layout discipline, typography, brand language, and portfolio presentation.',
    stats: [
      { label: '6 Modules', key: 'modules' },
      { label: '30 Lessons', key: 'lessons' },
      { label: '11+ Hours', key: 'hours' },
      { label: 'Identity Project', key: 'project' },
    ],
    modules: [
      {
        id: 'gd01',
        number: '01',
        title: 'Design Foundations',
        description:
          'Understand the principles behind premium visuals and learn how to judge design decisions.',
        lessonCount: 5,
        durationLabel: '1h 30m',
        lessons: [
          'What makes design work',
          'Hierarchy and visual weight',
          'Balance and contrast',
          'Reference analysis',
          'Building a design eye',
        ],
      },
      {
        id: 'gd02',
        number: '02',
        title: 'Composition & Layout',
        description:
          'Create clean compositions using spacing, grids, scale, and alignment.',
        lessonCount: 5,
        durationLabel: '1h 45m',
        lessons: [
          'Grid systems',
          'Spacing and alignment',
          'Focal points',
          'Poster and post layout',
          'Layout critique process',
        ],
      },
      {
        id: 'gd03',
        number: '03',
        title: 'Typography',
        description:
          'Choose, pair, and arrange type with clarity, personality, and brand intent.',
        lessonCount: 5,
        durationLabel: '1h 35m',
        lessons: [
          'Type anatomy basics',
          'Font pairing',
          'Arabic and English hierarchy',
          'Typography for social design',
          'Refining type layouts',
        ],
      },
      {
        id: 'gd04',
        number: '04',
        title: 'Color & Brand Systems',
        description:
          'Build recognizable visual systems with color, assets, and repeatable brand rules.',
        lessonCount: 5,
        durationLabel: '2h',
        lessons: [
          'Color psychology and mood',
          'Palette building',
          'Logo direction basics',
          'Brand asset systems',
          'Consistency across formats',
        ],
      },
      {
        id: 'gd05',
        number: '05',
        title: 'Social Media Design',
        description:
          'Design campaign-ready social visuals that feel cohesive, sharp, and easy to scan.',
        lessonCount: 5,
        durationLabel: '1h 40m',
        lessons: [
          'Campaign visual language',
          'Carousel structure',
          'Ad creative layout',
          'Template systems',
          'Exporting for platforms',
        ],
      },
      {
        id: 'gd06',
        number: '06',
        title: 'Portfolio Identity Project',
        description:
          'Create a compact identity project and present your design thinking with confidence.',
        lessonCount: 5,
        durationLabel: '2h 20m',
        lessons: [
          'Project brief',
          'Moodboard and direction',
          'Logo and visual assets',
          'Social design set',
          'Portfolio case slide',
        ],
      },
    ],
  },
  'ai-video-making': {
    description:
      'A creator-focused AI video workflow that turns ideas into directed scenes, polished edits, and a finished video project.',
    stats: [
      { label: '6 Modules', key: 'modules' },
      { label: '28 Lessons', key: 'lessons' },
      { label: '8+ Hours', key: 'hours' },
      { label: 'AI Workflow', key: 'ai' },
    ],
    modules: [
      {
        id: 'ai01',
        number: '01',
        title: 'AI Creative Foundations',
        description:
          'Understand how to use AI as a production partner while keeping creative direction in your hands.',
        lessonCount: 4,
        durationLabel: '55 min',
        lessons: [
          'AI video workflow overview',
          'Choosing the right tools',
          'Creative taste vs automation',
          'Building reference direction',
        ],
      },
      {
        id: 'ai02',
        number: '02',
        title: 'Prompting & Visual Direction',
        description:
          'Write prompts that control mood, camera, style, motion, and consistency.',
        lessonCount: 5,
        durationLabel: '1h 25m',
        lessons: [
          'Prompt structure',
          'Mood and style language',
          'Camera and lens direction',
          'Character and scene consistency',
          'Prompt iteration workflow',
        ],
      },
      {
        id: 'ai03',
        number: '03',
        title: 'Image-to-Video Workflow',
        description:
          'Turn still frames into controlled video moments with strong visual continuity.',
        lessonCount: 5,
        durationLabel: '1h 30m',
        lessons: [
          'Generating source frames',
          'Preparing images for motion',
          'Image-to-video settings',
          'Motion prompt control',
          'Selecting usable takes',
        ],
      },
      {
        id: 'ai04',
        number: '04',
        title: 'Voice, Script & Sound',
        description:
          'Build scripts, voiceovers, subtitles, and sound layers that support the final story.',
        lessonCount: 5,
        durationLabel: '1h 35m',
        lessons: [
          'AI-assisted scripting',
          'Voice generation workflow',
          'Music and sound direction',
          'Subtitle style',
          'Audio cleanup and balance',
        ],
      },
      {
        id: 'ai05',
        number: '05',
        title: 'Editing AI Outputs',
        description:
          'Bring generated clips into an editor and shape them into a coherent finished piece.',
        lessonCount: 5,
        durationLabel: '1h 45m',
        lessons: [
          'Organizing generated clips',
          'Cutting for continuity',
          'Fixing weak moments',
          'Color and finishing pass',
          'Exporting for social platforms',
        ],
      },
      {
        id: 'ai06',
        number: '06',
        title: 'Final AI Video Project',
        description:
          'Create a complete AI-assisted video with a clear concept, polished edit, and final presentation.',
        lessonCount: 4,
        durationLabel: '1h 50m',
        lessons: [
          'Final project brief',
          'Visual direction board',
          'Generation and selection pass',
          'Final edit and presentation',
        ],
      },
    ],
  },
};

export const getCourseCurriculumById = (courseId) => courseCurriculums[courseId];
