export const taskStats = {
  openTasks: 5,
  submittedTasks: 2,
  reviewedTasks: 8,
  weeklyPoints: 420,
};

export const currentTasks = [
  {
    id: 'motion-title-sequence',
    title: 'Create a 7-second title sequence',
    category: 'Motion Graphics',
    difficulty: 'Intermediate',
    deadline: 'May 18',
    points: 180,
    status: 'Open',
    description: 'Design a short cinematic opener using type, rhythm, and one controlled camera move.',
    requirements: [
      'Use at least 3 typography layers',
      'Add one intentional transition',
      'Export in 1080x1920 or 1920x1080',
    ],
  },
  {
    id: 'edit-rhythm-pass',
    title: 'Edit rhythm polish pass',
    category: 'Video Editing',
    difficulty: 'Beginner',
    deadline: 'May 20',
    points: 120,
    status: 'Submitted',
    description: 'Take a rough 20-second edit and improve its pacing, cuts, sound energy, and ending beat.',
    requirements: [
      'Include before and after versions',
      'Use at least 4 sound layers',
      'Write a short note about your pacing choices',
    ],
  },
  {
    id: 'brand-poster-system',
    title: 'Build a premium poster system',
    category: 'Graphic Design',
    difficulty: 'Advanced',
    deadline: 'May 24',
    points: 220,
    status: 'Reviewed',
    description: 'Create a three-poster visual system with consistent spacing, type scale, and image treatment.',
    requirements: [
      'Submit 3 related poster layouts',
      'Use one shared grid system',
      'Include a 4-slide process breakdown',
    ],
  },
];

export const weeklyChallenges = [
  {
    id: 'one-scene-story',
    title: 'One Scene Story',
    category: 'Creative Direction',
    difficulty: 'Intermediate',
    deadline: 'This Friday',
    points: 260,
    status: 'Open',
    description: 'Tell a clear visual story using one scene, one mood shift, and one intentional final frame.',
    requirements: [
      'Keep it under 15 seconds',
      'Use a beginning, shift, and ending',
      'Add a short caption explaining the story',
    ],
  },
  {
    id: 'taste-board',
    title: 'Taste Board Sprint',
    category: 'Research',
    difficulty: 'Beginner',
    deadline: 'Sunday',
    points: 90,
    status: 'Open',
    description: 'Collect a focused reference board that shows a specific visual taste, not random inspiration.',
    requirements: [
      'Collect 12 references',
      'Group references into 3 mood labels',
      'Write 3 observations about style and composition',
    ],
  },
];
