/**
 * Phase 1 mock data for the Messages screen.
 * Replaced by Redux/API selectors in Phase 2 (see docs/messages/04-phase2-dynamic.md).
 */

export const conversations = [
  {
    id: 1,
    name: 'David Wilson',
    role: 'Software Engineer45',
    time: '',
    preview: '',
    avatar: '',
    read: false,
    status: 'Applied',
  },
  {
    id: 2,
    name: 'Yuli Nako',
    role: 'Software Engineer',
    time: '9 months ago',
    preview: 'khj',
    avatar: '',
    read: true,
  },
  {
    id: 3,
    name: 'Abdülaziz Smith',
    role: 'Software Engineer',
    time: '1 year ago',
    preview: 'hi',
    avatar: '',
    read: true,
  },
  {
    id: 4,
    name: 'Elaine Nunez',
    role: 'Software Engineer',
    time: '1 year ago',
    preview: 'khk',
    avatar: '',
    read: null,
  },
  {
    id: 5,
    name: 'Yuli Nako',
    role: 'Software Engineer',
    time: '1 year ago',
    preview: 'You are requested for a scheduled m…',
    avatar: '',
    read: null,
  },
  {
    id: 6,
    name: 'Michael Hamilton',
    role: 'Software Engineer new edit',
    time: '',
    preview: '',
    avatar: null,
    read: null,
  },
  {
    id: 7,
    name: 'Jason Miles',
    role: 'Software Engineer new edit',
    time: '5 months ago',
    preview: 'jjjj',
    avatar: null,
    read: null,
  },
  {
    id: 8,
    name: 'Cody Walker',
    role: 'Software Engineer new edit',
    time: '2 months ago',
    preview: 'kjkfjk',
    avatar: null,
    read: null,
  },
];

export const thread = {
  id: 1,
  name: 'David Wilson',
  first: 'David',
  role: 'Software Engineer45',
  status: 'Applied',
  groups: [
    {
      label: null,
      items: [{ type: 'time', text: '05:32 AM' }],
    },
    {
      label: 'WEDNESDAY, 03 JUN 2026',
      items: [
        { type: 'note', author: 'Yuli Nako', time: '04:31 AM' },
        { type: 'note', author: 'Yuli Nako', time: '04:32 AM' },
        { type: 'note', author: 'Yuli Nako', time: '04:32 AM' },
        { type: 'note', author: 'Yuli Nako', time: '04:32 AM' },
        { type: 'note', author: 'Yuli Nako', time: '04:37 AM' },
      ],
    },
    {
      label: 'SUNDAY, 21 JUN 2026',
      items: [{ type: 'note', author: 'Yuli Nako', time: '06:28 AM' }],
    },
  ],
};

export const notes = [
  {
    id: 1,
    author: 'Yuli Nako (You)',
    body: 'ok',
    time: '1 hour ago',
    reactions: [],
    replies: [],
  },
  {
    id: 2,
    author: 'Yuli Nako (You)',
    body: 'mm',
    time: '2 weeks ago',
    reactions: [{ emoji: '😍', count: 1 }],
    replies: [
      {
        id: 21,
        author: 'Yuli Nako (You)',
        body: 'hee',
        time: '2 weeks',
        reactions: [],
        replies: [
          {
            id: 22,
            author: 'Yuli Nako (You)',
            body: "what's up!",
            time: '2 weeks',
            reactions: [],
            replies: [
              {
                id: 23,
                author: 'Yuli Nako (You)',
                body: 'oh noo',
                time: '2 weeks',
                reactions: [],
                replies: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const newApplicants = [
  { id: 1, name: 'David Wilson', job: 'Software Engineer', avatar: '' },
  { id: 2, name: 'David Wilson', job: 'Software Engineer', avatar: '' },
  { id: 3, name: 'Alice Smith', job: 'Software Engineer', avatar: '' },
  { id: 4, name: 'Emma Moore', job: 'Software Engineer', avatar: '' },
  { id: 5, name: 'David Wilson', job: 'Copy Candidate Test Job', avatar: '' },
  { id: 6, name: 'Emma Moore', job: 'Copy Candidate Test Job', avatar: '' },
  { id: 7, name: 'Alice Smith', job: 'Copy Candidate Test Job', avatar: '' },
];

export const jobOptions = [{ value: '', label: 'Select option' }];

export const managerOptions = [{ value: 'everybody', label: 'Everybody' }];
