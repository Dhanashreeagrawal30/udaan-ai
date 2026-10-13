import { SchoolResource } from '../types';

export const INITIAL_SCHOOL_RESOURCES: SchoolResource[] = [
  {
    id: 'res-1',
    type: 'math_tutoring',
    label: 'Math & Quantitative Tutoring Slots',
    totalCapacity: 25,
    allocatedUnits: 19,
    unitDescription: 'weekly student slots',
    category: 'academic'
  },
  {
    id: 'res-2',
    type: 'reading_tutoring',
    label: 'Language & Literacy Lab Sessions',
    totalCapacity: 20,
    allocatedUnits: 14,
    unitDescription: 'weekly student slots',
    category: 'academic'
  },
  {
    id: 'res-3',
    type: 'teacher_mentoring',
    label: '1-on-1 Faculty Mentoring Check-ins',
    totalCapacity: 35,
    allocatedUnits: 26,
    unitDescription: 'bi-weekly slots',
    category: 'mentorship'
  },
  {
    id: 'res-4',
    type: 'counselor_hours',
    label: 'Student Wellbeing Support Specialist',
    totalCapacity: 30,
    allocatedUnits: 24,
    unitDescription: 'hours/week',
    category: 'mentorship'
  },
  {
    id: 'res-5',
    type: 'peer_study_circles',
    label: 'Guided Peer Study Circles',
    totalCapacity: 15,
    allocatedUnits: 9,
    unitDescription: 'active cohorts',
    category: 'academic'
  },
  {
    id: 'res-6',
    type: 'financial_welfare_review',
    label: 'Emergency Student Welfare Referrals',
    totalCapacity: 12,
    allocatedUnits: 5,
    unitDescription: 'case evaluations/mo',
    category: 'welfare'
  }
];
