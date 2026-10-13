import { Student } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-104',
    pseudonymousId: 'ST-104',
    gradeLevel: 'Grade 10',
    section: 'B',
    academicYear: '2025-2026',
    attendanceRate: 62.0,
    recentAverage: 48.0,
    previousAverage: 72.0,
    recentAbsenceTrend: 'increasing',
    missedAssessments: 3,
    homeworkCompletionRate: 42.0,
    riskProbability: 0.76,
    prediction: 'urgent_review_recommended',
    assignedStaff: 'Ms. Priya Sharma',
    followUpStatus: 'in_progress',
    lastAssessedAt: '2026-10-12T09:30:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: [
      'Attendance drop > 15%',
      'Steep decline in Mathematics',
      'Sibling care obligations reported',
      'Missed 3 unit evaluations'
    ],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 90.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W2', rate: 85.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W3', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W4', rate: 75.0, presentDays: 3, unexcusedDays: 1, excusedDays: 1 },
      { week: 'W5', rate: 70.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W6', rate: 65.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W7', rate: 60.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W8', rate: 58.0, presentDays: 2, unexcusedDays: 3, excusedDays: 0 },
      { week: 'W9', rate: 60.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W10', rate: 62.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 }
    ],
    assessmentHistory: [
      { id: 'as-1', subject: 'Mathematics', assessmentName: 'Algebra Midterm', score: 42, term: 'Term 1', date: '2026-09-28' },
      { id: 'as-2', subject: 'Science', assessmentName: 'Physics Lab Report', score: 50, term: 'Term 1', date: '2026-10-02' },
      { id: 'as-3', subject: 'English', assessmentName: 'Literature Essay', score: 58, term: 'Term 1', date: '2026-09-18' },
      { id: 'as-4', subject: 'Social Studies', assessmentName: 'Civics Quiz #2', score: 45, term: 'Term 1', date: '2026-10-05', isMissed: true },
      { id: 'as-5', subject: 'Computer Sci', assessmentName: 'Logic Coding Task', score: 40, term: 'Term 1', date: '2026-10-08', isMissed: true }
    ],
    contributingFactors: [
      { factor: 'Attendance rate (62.0%) is below the 82% benchmark', direction: 'increases_estimated_risk', importance: 0.48 },
      { factor: 'Notable drop in assessment scores (24.0 pt decline)', direction: 'increases_estimated_risk', importance: 0.40 },
      { factor: 'Absence trajectory flagged as "increasing" over recent weeks', direction: 'increases_estimated_risk', importance: 0.30 },
      { factor: '3 missed assessments in recent evaluation window', direction: 'increases_estimated_risk', importance: 0.28 }
    ],
    isDriftFlagged: true,
    driftReason: 'Persistent 28% attendance decline and consecutive unexcused Fridays',
    driftMagnitude: 28.0,
    supportPlanHistory: [
      {
        id: 'plan-104-1',
        studentId: 'std-104',
        studentPseudo: 'ST-104',
        primaryWarningSignal: 'Steep attendance decline accompanied by 24 pt drop in Math',
        interventionType: 'tutoring_math',
        interventionTitle: 'Intensive Math Peer Mentoring + Morning Transportation Sync',
        details: 'Bi-weekly 45 min remedial math sessions paired with senior peer tutor, plus bus schedule alignment with parent.',
        assignedStaff: 'Ms. Priya Sharma',
        createdDate: '2026-10-05',
        deadlineDate: '2026-10-25',
        status: 'in_progress',
        resourceType: 'math_tutoring',
        allocatedUnits: 2,
        baselineAttendance: 60.0,
        baselineAcademic: 45.0,
        leadingMetrics: [
          { metric: 'Bi-weekly Attendance', target: 'Reach >= 75%', checkpointDays: 14 },
          { metric: 'Math Quiz 3 Score', target: 'Score >= 55%', checkpointDays: 20 }
        ]
      }
    ],
    followUpNotes: [
      {
        id: 'fn-104-1',
        planId: 'plan-104-1',
        studentId: 'std-104',
        author: 'Ms. Priya Sharma',
        date: '2026-10-08',
        notes: 'Held introductory 15-minute supportive check-in. Student shared they have been caring for a younger sibling between 7:30-8:30 AM. Discussed adjusted morning arrival protocol with VP Academic.',
        observedAttendanceRate: 62.0,
        observedAcademicScore: 48.0,
        statusUpdate: 'in_progress'
      }
    ]
  },
  {
    id: 'std-108',
    pseudonymousId: 'ST-108',
    gradeLevel: 'Grade 11',
    section: 'A',
    academicYear: '2025-2026',
    attendanceRate: 71.5,
    recentAverage: 54.0,
    previousAverage: 78.5,
    recentAbsenceTrend: 'increasing',
    missedAssessments: 2,
    homeworkCompletionRate: 58.0,
    riskProbability: 0.69,
    prediction: 'urgent_review_recommended',
    assignedStaff: 'Mr. David Chen',
    followUpStatus: 'planned',
    lastAssessedAt: '2026-10-11T14:15:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: [
      'Attendance drop > 15%',
      'Unsubmitted chemistry lab reports',
      'Reported transportation gap'
    ],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 92.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W2', rate: 90.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W3', rate: 85.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W4', rate: 82.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W5', rate: 76.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W6', rate: 70.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W7', rate: 68.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W8', rate: 70.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W9', rate: 69.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W10', rate: 71.5, presentDays: 3, unexcusedDays: 1, excusedDays: 1 }
    ],
    assessmentHistory: [
      { id: 'as-6', subject: 'Chemistry', assessmentName: 'Thermodynamics Exam', score: 48, term: 'Term 1', date: '2026-10-01' },
      { id: 'as-7', subject: 'Calculus', assessmentName: 'Derivatives Quiz', score: 55, term: 'Term 1', date: '2026-09-29' },
      { id: 'as-8', subject: 'English', assessmentName: 'Rhetoric Presentation', score: 62, term: 'Term 1', date: '2026-09-20' }
    ],
    contributingFactors: [
      { factor: 'Attendance rate (71.5%) falls below 82% threshold', direction: 'increases_estimated_risk', importance: 0.44 },
      { factor: 'Drop of 24.5 points in overall assessment scores', direction: 'increases_estimated_risk', importance: 0.41 },
      { factor: '2 consecutive missed chemistry lab submissions', direction: 'increases_estimated_risk', importance: 0.32 }
    ],
    isDriftFlagged: true,
    driftReason: 'Sudden 24.5 pt performance drop across STEM courses',
    driftMagnitude: 24.5,
    supportPlanHistory: [],
    followUpNotes: []
  },
  {
    id: 'std-215',
    pseudonymousId: 'ST-215',
    gradeLevel: 'Grade 9',
    section: 'C',
    academicYear: '2025-2026',
    attendanceRate: 77.0,
    recentAverage: 61.0,
    previousAverage: 73.0,
    recentAbsenceTrend: 'increasing',
    missedAssessments: 1,
    homeworkCompletionRate: 64.0,
    riskProbability: 0.48,
    prediction: 'review_recommended',
    assignedStaff: 'Ms. Anita Desai',
    followUpStatus: 'awaiting_follow_up',
    lastAssessedAt: '2026-10-10T11:00:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: [
      'Transition shock into Grade 9',
      'Language comprehension support flag'
    ],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 88.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W2', rate: 84.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W3', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W4', rate: 76.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W5', rate: 78.0, presentDays: 3, unexcusedDays: 1, excusedDays: 1 },
      { week: 'W6', rate: 75.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W7', rate: 78.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W8', rate: 77.0, presentDays: 3, unexcusedDays: 1, excusedDays: 1 },
      { week: 'W9', rate: 76.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W10', rate: 77.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 }
    ],
    assessmentHistory: [
      { id: 'as-9', subject: 'English', assessmentName: 'Vocabulary Test', score: 54, term: 'Term 1', date: '2026-10-04' },
      { id: 'as-10', subject: 'General Science', assessmentName: 'Cell Biology Midterm', score: 62, term: 'Term 1', date: '2026-09-30' },
      { id: 'as-11', subject: 'Algebra I', assessmentName: 'Linear Equations', score: 67, term: 'Term 1', date: '2026-09-22' }
    ],
    contributingFactors: [
      { factor: 'Attendance rate (77.0%) is below 82% benchmark', direction: 'increases_estimated_risk', importance: 0.36 },
      { factor: 'Assessment decline of 12.0 points compared to prior baseline', direction: 'increases_estimated_risk', importance: 0.29 },
      { factor: 'Absence trend slightly increasing', direction: 'increases_estimated_risk', importance: 0.22 }
    ],
    supportPlanHistory: [
      {
        id: 'plan-215-1',
        studentId: 'std-215',
        studentPseudo: 'ST-215',
        primaryWarningSignal: 'Grade 9 transition adjustment and language comprehension hesitation',
        interventionType: 'reading_tutoring',
        interventionTitle: 'Literacy Lab Mentorship + Bi-weekly Check-in',
        details: 'Assigned to Literacy Lab 2x weekly with bilingual support facilitator.',
        assignedStaff: 'Ms. Anita Desai',
        createdDate: '2026-09-25',
        deadlineDate: '2026-10-20',
        status: 'awaiting_follow_up',
        resourceType: 'reading_tutoring',
        allocatedUnits: 2,
        baselineAttendance: 76.0,
        baselineAcademic: 58.0,
        leadingMetrics: [
          { metric: 'Vocabulary Quiz Retake', target: 'Score >= 70%', checkpointDays: 14 }
        ]
      }
    ],
    followUpNotes: [
      {
        id: 'fn-215-1',
        planId: 'plan-215-1',
        studentId: 'std-215',
        author: 'Ms. Anita Desai',
        date: '2026-10-02',
        notes: 'Attended 3 of 4 literacy sessions. Student expresses more confidence speaking in class; vocabulary comprehension showed marked improvement in informal review.',
        observedAttendanceRate: 77.0,
        observedAcademicScore: 61.0,
        statusUpdate: 'awaiting_follow_up'
      }
    ]
  },
  {
    id: 'std-312',
    pseudonymousId: 'ST-312',
    gradeLevel: 'Grade 12',
    section: 'A',
    academicYear: '2025-2026',
    attendanceRate: 64.0,
    recentAverage: 52.0,
    previousAverage: 79.0,
    recentAbsenceTrend: 'critical',
    missedAssessments: 4,
    homeworkCompletionRate: 38.0,
    riskProbability: 0.83,
    prediction: 'urgent_review_recommended',
    assignedStaff: 'Dr. Rajesh Rao',
    followUpStatus: 'reassessment_needed',
    lastAssessedAt: '2026-10-12T16:00:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: [
      'Chronic unexcused absences',
      'Senior graduation unit shortfall',
      'Part-time evening employment'
    ],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 85.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W2', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W3', rate: 70.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W4', rate: 65.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W5', rate: 60.0, presentDays: 2, unexcusedDays: 3, excusedDays: 0 },
      { week: 'W6', rate: 58.0, presentDays: 2, unexcusedDays: 3, excusedDays: 0 },
      { week: 'W7', rate: 55.0, presentDays: 2, unexcusedDays: 3, excusedDays: 0 },
      { week: 'W8', rate: 62.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W9', rate: 60.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W10', rate: 64.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 }
    ],
    assessmentHistory: [
      { id: 'as-12', subject: 'Physics', assessmentName: 'Wave Mechanics', score: 44, term: 'Term 1', date: '2026-10-06' },
      { id: 'as-13', subject: 'Economics', assessmentName: 'Macroeconomics Midterm', score: 49, term: 'Term 1', date: '2026-09-27' },
      { id: 'as-14', subject: 'English', assessmentName: 'Critical Analysis Essay', score: 63, term: 'Term 1', date: '2026-09-15' }
    ],
    contributingFactors: [
      { factor: 'Absence trend critical (sustained 40% absence velocity in senior year)', direction: 'increases_estimated_risk', importance: 0.48 },
      { factor: 'Attendance rate (64.0%) severely impacts graduation requirements', direction: 'increases_estimated_risk', importance: 0.44 },
      { factor: 'Drop of 27.0 points in cumulative assessment average', direction: 'increases_estimated_risk', importance: 0.41 },
      { factor: '4 missed assessments across physics and economics', direction: 'increases_estimated_risk', importance: 0.35 }
    ],
    isDriftFlagged: true,
    driftReason: 'Accelerated senior year absence spike; 4 missed key evaluations',
    driftMagnitude: 32.0,
    supportPlanHistory: [],
    followUpNotes: []
  },
  {
    id: 'std-402',
    pseudonymousId: 'ST-402',
    gradeLevel: 'Grade 10',
    section: 'A',
    academicYear: '2025-2026',
    attendanceRate: 83.5,
    recentAverage: 65.0,
    previousAverage: 71.0,
    recentAbsenceTrend: 'stable',
    missedAssessments: 0,
    homeworkCompletionRate: 75.0,
    riskProbability: 0.35,
    prediction: 'on_track',
    assignedStaff: 'Mr. David Chen',
    followUpStatus: 'completed',
    lastAssessedAt: '2026-10-09T08:45:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: ['Resolved minor health absence earlier in term'],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 80.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W2', rate: 75.0, presentDays: 3, unexcusedDays: 0, excusedDays: 2 },
      { week: 'W3', rate: 80.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W4', rate: 82.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W5', rate: 85.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W6', rate: 85.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W7', rate: 86.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W8', rate: 85.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W9', rate: 88.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W10', rate: 83.5, presentDays: 4, unexcusedDays: 0, excusedDays: 1 }
    ],
    assessmentHistory: [
      { id: 'as-15', subject: 'Mathematics', assessmentName: 'Geometry Exam', score: 68, term: 'Term 1', date: '2026-10-03' },
      { id: 'as-16', subject: 'History', assessmentName: 'World War Essay', score: 64, term: 'Term 1', date: '2026-09-24' }
    ],
    contributingFactors: [
      { factor: 'Attendance has stabilized above 83% following excused medical leave', direction: 'decreases_estimated_risk', importance: 0.32 },
      { factor: 'All term assignments completed on schedule', direction: 'decreases_estimated_risk', importance: 0.28 }
    ],
    supportPlanHistory: [
      {
        id: 'plan-402-1',
        studentId: 'std-402',
        studentPseudo: 'ST-402',
        primaryWarningSignal: 'Temporary dip during week 2 illness recovery',
        interventionType: 'teacher_checkin',
        interventionTitle: 'Medical Recovery Catch-up Schedule',
        details: 'Weekly 15 min check-in to reschedule missed geometry quizzes and provide class notes.',
        assignedStaff: 'Mr. David Chen',
        createdDate: '2026-09-12',
        deadlineDate: '2026-10-05',
        status: 'completed',
        resourceType: 'teacher_mentoring',
        allocatedUnits: 1,
        baselineAttendance: 76.0,
        baselineAcademic: 60.0,
        leadingMetrics: [
          { metric: 'Missed Quiz Retake', target: 'Completed by Day 10', checkpointDays: 10 }
        ],
        observedOutcome: {
          attendanceChange: 7.5,
          academicChange: 5.0,
          completionNotes: 'Student completed all rescheduled assignments with solid scores. Health fully recovered. Attendance stabilized above 83%.',
          completedAt: '2026-10-05'
        }
      }
    ],
    followUpNotes: [
      {
        id: 'fn-402-1',
        planId: 'plan-402-1',
        studentId: 'std-402',
        author: 'Mr. David Chen',
        date: '2026-10-05',
        notes: 'Final review completed. Student is engaged, confident, and on track. Case closed with positive resolution.',
        observedAttendanceRate: 83.5,
        observedAcademicScore: 65.0,
        statusUpdate: 'completed'
      }
    ]
  },
  {
    id: 'std-501',
    pseudonymousId: 'ST-501',
    gradeLevel: 'Grade 11',
    section: 'B',
    academicYear: '2025-2026',
    attendanceRate: 94.0,
    recentAverage: 88.0,
    previousAverage: 86.5,
    recentAbsenceTrend: 'stable',
    missedAssessments: 0,
    homeworkCompletionRate: 96.0,
    riskProbability: 0.08,
    prediction: 'on_track',
    assignedStaff: 'Ms. Priya Sharma',
    followUpStatus: 'none',
    lastAssessedAt: '2026-10-12T15:20:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: ['Peer Study Leader'],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 96.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W2', rate: 95.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W3', rate: 94.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W4', rate: 93.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W5', rate: 94.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W6', rate: 95.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W7', rate: 94.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W8', rate: 93.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W9', rate: 94.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W10', rate: 94.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 }
    ],
    assessmentHistory: [
      { id: 'as-17', subject: 'Calculus', assessmentName: 'Limits & Continuity', score: 92, term: 'Term 1', date: '2026-10-04' },
      { id: 'as-18', subject: 'Physics', assessmentName: 'Kinematics Exam', score: 87, term: 'Term 1', date: '2026-09-28' },
      { id: 'as-19', subject: 'English', assessmentName: 'Research Paper', score: 85, term: 'Term 1', date: '2026-09-19' }
    ],
    contributingFactors: [
      { factor: 'High consistent attendance (94.0%)', direction: 'decreases_estimated_risk', importance: 0.35 },
      { factor: 'Strong academic performance across STEM subjects (88.0%)', direction: 'decreases_estimated_risk', importance: 0.32 },
      { factor: 'Near-perfect homework completion rate (96.0%)', direction: 'decreases_estimated_risk', importance: 0.25 }
    ],
    supportPlanHistory: [],
    followUpNotes: []
  },
  {
    id: 'std-508',
    pseudonymousId: 'ST-508',
    gradeLevel: 'Grade 9',
    section: 'A',
    academicYear: '2025-2026',
    attendanceRate: 68.0,
    recentAverage: 51.0,
    previousAverage: 69.0,
    recentAbsenceTrend: 'increasing',
    missedAssessments: 2,
    homeworkCompletionRate: 46.0,
    riskProbability: 0.72,
    prediction: 'urgent_review_recommended',
    assignedStaff: 'Ms. Anita Desai',
    followUpStatus: 'in_progress',
    lastAssessedAt: '2026-10-11T10:00:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: ['First-generation learner', 'Math foundational gap'],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 85.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W2', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W3', rate: 75.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W4', rate: 70.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W5', rate: 68.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W6', rate: 65.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W7', rate: 64.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W8', rate: 66.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W9', rate: 67.0, presentDays: 3, unexcusedDays: 1, excusedDays: 1 },
      { week: 'W10', rate: 68.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 }
    ],
    assessmentHistory: [
      { id: 'as-20', subject: 'Math', assessmentName: 'Pre-Algebra Test', score: 45, term: 'Term 1', date: '2026-10-02' },
      { id: 'as-21', subject: 'English', assessmentName: 'Reading Diagnostic', score: 56, term: 'Term 1', date: '2026-09-21' }
    ],
    contributingFactors: [
      { factor: 'Attendance rate (68.0%) below required minimum', direction: 'increases_estimated_risk', importance: 0.45 },
      { factor: '18 point drop in recent assessments', direction: 'increases_estimated_risk', importance: 0.38 },
      { factor: 'Absence trend flagged as increasing', direction: 'increases_estimated_risk', importance: 0.28 }
    ],
    supportPlanHistory: [
      {
        id: 'plan-508-1',
        studentId: 'std-508',
        studentPseudo: 'ST-508',
        primaryWarningSignal: 'Grade 9 foundational math struggles and rising Friday absences',
        interventionType: 'tutoring_math',
        interventionTitle: 'Foundational Math Tutor + Family Consultation',
        details: 'Weekly after-school tutoring circle plus consultation with guardian on attendance schedule.',
        assignedStaff: 'Ms. Anita Desai',
        createdDate: '2026-10-07',
        deadlineDate: '2026-10-28',
        status: 'in_progress',
        resourceType: 'math_tutoring',
        allocatedUnits: 2,
        baselineAttendance: 65.0,
        baselineAcademic: 48.0,
        leadingMetrics: [
          { metric: 'Tutoring Attendance', target: '100% attendance across 3 weeks', checkpointDays: 21 }
        ]
      }
    ],
    followUpNotes: []
  },
  {
    id: 'std-614',
    pseudonymousId: 'ST-614',
    gradeLevel: 'Grade 12',
    section: 'C',
    academicYear: '2025-2026',
    attendanceRate: 79.0,
    recentAverage: 63.0,
    previousAverage: 75.0,
    recentAbsenceTrend: 'increasing',
    missedAssessments: 1,
    homeworkCompletionRate: 68.0,
    riskProbability: 0.44,
    prediction: 'review_recommended',
    assignedStaff: 'Dr. Rajesh Rao',
    followUpStatus: 'planned',
    lastAssessedAt: '2026-10-10T14:00:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: ['Post-secondary vocational counseling needed'],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 85.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W2', rate: 82.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W3', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W4', rate: 78.0, presentDays: 3, unexcusedDays: 1, excusedDays: 1 },
      { week: 'W5', rate: 77.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W6', rate: 76.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W7', rate: 78.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W8', rate: 79.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W9', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W10', rate: 79.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 }
    ],
    assessmentHistory: [
      { id: 'as-22', subject: 'Business Studies', assessmentName: 'Marketing Project', score: 65, term: 'Term 1', date: '2026-10-01' },
      { id: 'as-23', subject: 'Accountancy', assessmentName: 'Balance Sheet Exam', score: 58, term: 'Term 1', date: '2026-09-25' }
    ],
    contributingFactors: [
      { factor: 'Attendance rate (79.0%) marginally below 82%', direction: 'increases_estimated_risk', importance: 0.32 },
      { factor: '12 point drop in accountancy midterm', direction: 'increases_estimated_risk', importance: 0.27 }
    ],
    supportPlanHistory: [],
    followUpNotes: []
  },
  {
    id: 'std-720',
    pseudonymousId: 'ST-720',
    gradeLevel: 'Grade 10',
    section: 'C',
    academicYear: '2025-2026',
    attendanceRate: 88.5,
    recentAverage: 76.0,
    previousAverage: 74.0,
    recentAbsenceTrend: 'stable',
    missedAssessments: 0,
    homeworkCompletionRate: 85.0,
    riskProbability: 0.16,
    prediction: 'on_track',
    assignedStaff: 'Mr. David Chen',
    followUpStatus: 'none',
    lastAssessedAt: '2026-10-08T09:10:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: ['Sports team captain'],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 90.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W2', rate: 88.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W3', rate: 87.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W4', rate: 89.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W5', rate: 88.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W6', rate: 89.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W7', rate: 88.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W8', rate: 89.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W9', rate: 88.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W10', rate: 88.5, presentDays: 4, unexcusedDays: 0, excusedDays: 1 }
    ],
    assessmentHistory: [
      { id: 'as-24', subject: 'Science', assessmentName: 'Chemistry Unit 1', score: 78, term: 'Term 1', date: '2026-10-03' },
      { id: 'as-25', subject: 'English', assessmentName: 'Grammar & Prose', score: 74, term: 'Term 1', date: '2026-09-17' }
    ],
    contributingFactors: [
      { factor: 'Stable attendance pattern (88.5%)', direction: 'decreases_estimated_risk', importance: 0.28 },
      { factor: 'Positive academic trend (+2.0 points)', direction: 'decreases_estimated_risk', importance: 0.22 }
    ],
    supportPlanHistory: [],
    followUpNotes: []
  },
  {
    id: 'std-831',
    pseudonymousId: 'ST-831',
    gradeLevel: 'Grade 9',
    section: 'B',
    academicYear: '2025-2026',
    attendanceRate: 73.0,
    recentAverage: 57.0,
    previousAverage: 76.0,
    recentAbsenceTrend: 'increasing',
    missedAssessments: 2,
    homeworkCompletionRate: 52.0,
    riskProbability: 0.62,
    prediction: 'review_recommended',
    assignedStaff: 'Ms. Priya Sharma',
    followUpStatus: 'planned',
    lastAssessedAt: '2026-10-12T13:45:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: ['Peer conflict reported', 'English language learner'],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 88.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W2', rate: 84.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W3', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W4', rate: 76.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W5', rate: 72.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W6', rate: 70.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W7', rate: 69.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W8', rate: 72.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W9', rate: 71.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W10', rate: 73.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 }
    ],
    assessmentHistory: [
      { id: 'as-26', subject: 'Math', assessmentName: 'Linear Systems', score: 52, term: 'Term 1', date: '2026-10-05' },
      { id: 'as-27', subject: 'Science', assessmentName: 'Forces & Energy', score: 62, term: 'Term 1', date: '2026-09-26' }
    ],
    contributingFactors: [
      { factor: 'Attendance rate (73.0%) is below 82%', direction: 'increases_estimated_risk', importance: 0.40 },
      { factor: '19 point academic drop from middle school baseline', direction: 'increases_estimated_risk', importance: 0.36 },
      { factor: '2 missed unit quizzes', direction: 'increases_estimated_risk', importance: 0.26 }
    ],
    supportPlanHistory: [],
    followUpNotes: []
  },
  {
    id: 'std-940',
    pseudonymousId: 'ST-940',
    gradeLevel: 'Grade 11',
    section: 'C',
    academicYear: '2025-2026',
    attendanceRate: 81.0,
    recentAverage: 60.5,
    previousAverage: 68.0,
    recentAbsenceTrend: 'stable',
    missedAssessments: 1,
    homeworkCompletionRate: 69.0,
    riskProbability: 0.42,
    prediction: 'review_recommended',
    assignedStaff: 'Dr. Rajesh Rao',
    followUpStatus: 'awaiting_follow_up',
    lastAssessedAt: '2026-10-10T12:00:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: ['Financial scholarship recipient'],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 84.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W2', rate: 82.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W3', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W4', rate: 79.0, presentDays: 3, unexcusedDays: 2, excusedDays: 0 },
      { week: 'W5', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W6', rate: 81.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W7', rate: 80.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W8', rate: 81.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W9', rate: 82.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
      { week: 'W10', rate: 81.0, presentDays: 4, unexcusedDays: 1, excusedDays: 0 }
    ],
    assessmentHistory: [
      { id: 'as-28', subject: 'History', assessmentName: 'Colonial India Essay', score: 64, term: 'Term 1', date: '2026-09-29' },
      { id: 'as-29', subject: 'Political Sci', assessmentName: 'Constitutional Design', score: 57, term: 'Term 1', date: '2026-10-02' }
    ],
    contributingFactors: [
      { factor: 'Attendance rate (81.0%) borderline review zone', direction: 'increases_estimated_risk', importance: 0.28 },
      { factor: '7.5 point moderate academic decline', direction: 'increases_estimated_risk', importance: 0.24 }
    ],
    supportPlanHistory: [],
    followUpNotes: []
  },
  {
    id: 'std-955',
    pseudonymousId: 'ST-955',
    gradeLevel: 'Grade 12',
    section: 'B',
    academicYear: '2025-2026',
    attendanceRate: 91.0,
    recentAverage: 82.0,
    previousAverage: 80.0,
    recentAbsenceTrend: 'stable',
    missedAssessments: 0,
    homeworkCompletionRate: 92.0,
    riskProbability: 0.12,
    prediction: 'on_track',
    assignedStaff: 'Ms. Priya Sharma',
    followUpStatus: 'none',
    lastAssessedAt: '2026-10-12T10:10:00Z',
    reportingPeriod: 'Term 1 (Weeks 1-10)',
    supportIndicators: ['College prep track'],
    weeklyAttendanceHistory: [
      { week: 'W1', rate: 92.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W2', rate: 90.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W3', rate: 91.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W4', rate: 90.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W5', rate: 92.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W6', rate: 91.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W7', rate: 90.0, presentDays: 4, unexcusedDays: 0, excusedDays: 1 },
      { week: 'W8', rate: 91.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W9', rate: 92.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
      { week: 'W10', rate: 91.0, presentDays: 5, unexcusedDays: 0, excusedDays: 0 }
    ],
    assessmentHistory: [
      { id: 'as-30', subject: 'English', assessmentName: 'Senior Thesis Draft', score: 85, term: 'Term 1', date: '2026-10-04' },
      { id: 'as-31', subject: 'Math', assessmentName: 'Statistics Midterm', score: 79, term: 'Term 1', date: '2026-09-22' }
    ],
    contributingFactors: [
      { factor: 'Consistently high attendance (91.0%)', direction: 'decreases_estimated_risk', importance: 0.32 },
      { factor: 'Positive academic trajectory', direction: 'decreases_estimated_risk', importance: 0.25 }
    ],
    supportPlanHistory: [],
    followUpNotes: []
  }
];
