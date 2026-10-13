export type UserRole = 'school_administrator' | 'teacher' | 'authorized_support_staff';

export type AbsenceTrend = 'stable' | 'increasing' | 'critical';

export type PredictionCategory = 'on_track' | 'review_recommended' | 'urgent_review_recommended';

export type FollowUpStatus = 
  | 'none'
  | 'planned' 
  | 'in_progress' 
  | 'awaiting_follow_up' 
  | 'completed' 
  | 'reassessment_needed';

export interface ContributingFactor {
  factor: string;
  direction: 'increases_estimated_risk' | 'decreases_estimated_risk';
  importance: number;
}

export interface WeeklyAttendance {
  week: string;
  rate: number;
  presentDays: number;
  unexcusedDays: number;
  excusedDays: number;
}

export interface AssessmentRecord {
  id: string;
  subject: string;
  assessmentName: string;
  score: number;
  term: string;
  date: string;
  isMissed?: boolean;
}

export interface FollowUpNote {
  id: string;
  planId: string;
  studentId: string;
  author: string;
  date: string;
  notes: string;
  observedAttendanceRate?: number;
  observedAcademicScore?: number;
  statusUpdate: FollowUpStatus;
}

export interface SupportPlan {
  id: string;
  studentId: string;
  studentPseudo: string;
  primaryWarningSignal: string;
  interventionType: string;
  interventionTitle: string;
  details: string;
  assignedStaff: string;
  createdDate: string;
  deadlineDate: string;
  status: FollowUpStatus;
  resourceType: string;
  allocatedUnits: number;
  baselineAttendance: number;
  baselineAcademic: number;
  leadingMetrics: {
    metric: string;
    target: string;
    checkpointDays: number;
  }[];
  observedOutcome?: {
    attendanceChange: number;
    academicChange: number;
    completionNotes: string;
    completedAt: string;
  };
}

export interface Student {
  id: string;
  pseudonymousId: string;
  gradeLevel: 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12';
  section: string;
  academicYear: string;
  attendanceRate: number; // 0 - 100
  recentAverage: number; // 0 - 100
  previousAverage: number; // 0 - 100
  recentAbsenceTrend: AbsenceTrend;
  missedAssessments: number;
  homeworkCompletionRate: number;
  riskProbability: number; // 0.0 - 1.0
  prediction: PredictionCategory;
  assignedStaff: string;
  followUpStatus: FollowUpStatus;
  lastAssessedAt: string;
  supportIndicators: string[];
  weeklyAttendanceHistory: WeeklyAttendance[];
  assessmentHistory: AssessmentRecord[];
  contributingFactors: ContributingFactor[];
  supportPlanHistory: SupportPlan[];
  followUpNotes: FollowUpNote[];
  reportingPeriod: string;
  isDriftFlagged?: boolean;
  driftReason?: string;
  driftMagnitude?: number;
}

export interface SchoolResource {
  id: string;
  type: string;
  label: string;
  totalCapacity: number;
  allocatedUnits: number;
  unitDescription: string;
  category: 'academic' | 'mentorship' | 'welfare';
}

export interface PredictApiRequest {
  student_id: string;
  features: {
    attendance_rate: number;
    recent_average: number;
    previous_average: number;
    recent_absence_trend: string;
    missed_assessments?: number;
    homework_completion_rate?: number;
  };
}

export interface PredictApiResponse {
  student_id: string;
  prediction: PredictionCategory;
  risk_probability: number;
  contributing_factors: ContributingFactor[];
  model_version: string;
  generated_at: string;
  data_quality_warning?: string | null;
  scientific_disclaimer?: string;
}

export interface ModelMetricsInfo {
  model_name: string;
  model_version: string;
  algorithm: string;
  training_samples: number;
  test_samples: number;
  decision_threshold: number;
  threshold_rationale: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    brier_score: number;
  };
  confusion_matrix: {
    true_negatives: number;
    false_positives: number;
    false_negatives: number;
    true_positives: number;
  };
  feature_importances: {
    feature: string;
    label: string;
    importance: number;
  }[];
  trained_timestamp: string;
}
