import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  SchoolResource, 
  UserRole, 
  FollowUpStatus, 
  SupportPlan, 
  FollowUpNote,
  PredictApiResponse
} from '../types';
import { INITIAL_STUDENTS } from '../data/mockStudents';
import { INITIAL_SCHOOL_RESOURCES } from '../data/mockResources';
import { checkBackendHealth, predictStudentRisk, BackendStatus } from '../services/api';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  students: Student[];
  resources: SchoolResource[];
  userRole: UserRole;
  currentRoute: string;
  reportingPeriod: string;
  backendStatus: BackendStatus;
  forceDemoMode: boolean;
  toasts: Toast[];
  selectedStudentForLab: Student | null;
  navigateTo: (route: string) => void;
  setUserRole: (role: UserRole) => void;
  setReportingPeriod: (period: string) => void;
  setForceDemoMode: (force: boolean) => void;
  setSelectedStudentForLab: (student: Student | null) => void;
  addStudent: (student: Omit<Student, 'id' | 'weeklyAttendanceHistory' | 'assessmentHistory' | 'contributingFactors' | 'supportPlanHistory' | 'followUpNotes'>) => Promise<void>;
  updateStudent: (student: Student) => void;
  importStudents: (imported: Student[]) => void;
  createSupportPlan: (plan: SupportPlan) => void;
  updateSupportPlanStatus: (
    planId: string, 
    newStatus: FollowUpStatus, 
    notes?: string, 
    observedAtt?: number, 
    observedAcad?: number
  ) => void;
  reassessStudentRisk: (studentId: string) => Promise<PredictApiResponse>;
  updateResourceCapacity: (resourceId: string, newCapacity: number) => void;
  refreshBackendHealth: () => Promise<void>;
  resetDemoData: () => void;
  addToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage state persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('udaan_students_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STUDENTS;
  });

  const [resources, setResources] = useState<SchoolResource[]>(() => {
    try {
      const saved = localStorage.getItem('udaan_resources_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SCHOOL_RESOURCES;
  });

  const [userRole, setUserRole] = useState<UserRole>('school_administrator');
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [reportingPeriod, setReportingPeriod] = useState<string>('term1');
  const [forceDemoMode, setForceDemoMode] = useState<boolean>(false);
  const [selectedStudentForLab, setSelectedStudentForLab] = useState<Student | null>(null);

  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    isConnected: false,
    modelLoaded: false,
    lastChecked: new Date().toISOString()
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('udaan_students_v2', JSON.stringify(students));
    } catch {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('udaan_resources_v2', JSON.stringify(resources));
    } catch {}
  }, [resources]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check backend health periodically
  const refreshBackendHealth = async () => {
    const status = await checkBackendHealth();
    setBackendStatus(status);
  };

  useEffect(() => {
    refreshBackendHealth();
    const interval = setInterval(refreshBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateTo = (route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reassess student risk via ML backend
  const reassessStudentRisk = async (studentId: string): Promise<PredictApiResponse> => {
    const student = students.find(s => s.id === studentId || s.pseudonymousId === studentId);
    if (!student) throw new Error('Student record not found');

    const { result, source } = await predictStudentRisk({
      student_id: student.pseudonymousId,
      features: {
        attendance_rate: student.attendanceRate,
        recent_average: student.recentAverage,
        previous_average: student.previousAverage,
        recent_absence_trend: student.recentAbsenceTrend,
        missed_assessments: student.missedAssessments,
        homework_completion_rate: student.homeworkCompletionRate
      }
    }, forceDemoMode);

    // Update student in state
    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          riskProbability: result.risk_probability,
          prediction: result.prediction,
          contributingFactors: result.contributing_factors,
          lastAssessedAt: result.generated_at
        };
      }
      return s;
    }));

    addToast(
      'success',
      'Risk Assessment Completed',
      source === 'connected_model' 
        ? `Inference executed by Connected Python ML Model (${result.model_version})`
        : `Assessment generated in Demo Mode (${result.model_version})`
    );

    return result;
  };

  const addStudent = async (data: Omit<Student, 'id' | 'weeklyAttendanceHistory' | 'assessmentHistory' | 'contributingFactors' | 'supportPlanHistory' | 'followUpNotes'>) => {
    const id = `std-${Date.now()}`;
    
    // Perform initial risk inference
    const { result } = await predictStudentRisk({
      student_id: data.pseudonymousId,
      features: {
        attendance_rate: data.attendanceRate,
        recent_average: data.recentAverage,
        previous_average: data.previousAverage,
        recent_absence_trend: data.recentAbsenceTrend,
        missed_assessments: data.missedAssessments,
        homework_completion_rate: data.homeworkCompletionRate
      }
    }, forceDemoMode);

    const newStudent: Student = {
      ...data,
      id,
      riskProbability: result.risk_probability,
      prediction: result.prediction,
      contributingFactors: result.contributing_factors,
      lastAssessedAt: result.generated_at,
      weeklyAttendanceHistory: [
        { week: 'W1', rate: Math.min(100, data.attendanceRate + 4), presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
        { week: 'W2', rate: Math.min(100, data.attendanceRate + 2), presentDays: 4, unexcusedDays: 1, excusedDays: 0 },
        { week: 'W3', rate: data.attendanceRate, presentDays: 4, unexcusedDays: 1, excusedDays: 0 }
      ],
      assessmentHistory: [
        { id: `as-${Date.now()}-1`, subject: 'General Evaluation', assessmentName: 'Baseline Entry', score: data.recentAverage, term: 'Term 1', date: new Date().toISOString().slice(0, 10) }
      ],
      supportPlanHistory: [],
      followUpNotes: []
    };

    setStudents(prev => [newStudent, ...prev]);
    addToast('success', 'Student Enrolled', `Record ${data.pseudonymousId} successfully added to directory.`);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    addToast('info', 'Record Updated', `Student ${updatedStudent.pseudonymousId} profile saved.`);
  };

  const importStudents = (imported: Student[]) => {
    setStudents(prev => [...imported, ...prev]);
    addToast('success', 'Import Successful', `Added ${imported.length} student records from CSV.`);
  };

  const createSupportPlan = (plan: SupportPlan) => {
    setStudents(prev => prev.map(s => {
      if (s.id === plan.studentId || s.pseudonymousId === plan.studentPseudo) {
        return {
          ...s,
          followUpStatus: plan.status,
          supportPlanHistory: [plan, ...s.supportPlanHistory]
        };
      }
      return s;
    }));

    // Update resource allocation
    setResources(prev => prev.map(r => {
      if (r.type === plan.resourceType) {
        return {
          ...r,
          allocatedUnits: Math.min(r.totalCapacity, r.allocatedUnits + plan.allocatedUnits)
        };
      }
      return r;
    }));

    addToast('success', 'Support Plan Created', `Support plan scheduled for ${plan.studentPseudo}. Assigned to ${plan.assignedStaff}.`);
  };

  const updateSupportPlanStatus = (
    planId: string, 
    newStatus: FollowUpStatus, 
    noteText?: string, 
    observedAtt?: number, 
    observedAcad?: number
  ) => {
    setStudents(prev => prev.map(student => {
      const planIndex = student.supportPlanHistory.findIndex(p => p.id === planId);
      if (planIndex === -1) return student;

      const updatedPlans = [...student.supportPlanHistory];
      const targetPlan = { ...updatedPlans[planIndex] };
      targetPlan.status = newStatus;

      if (newStatus === 'completed') {
        targetPlan.observedOutcome = {
          attendanceChange: (observedAtt ?? student.attendanceRate) - targetPlan.baselineAttendance,
          academicChange: (observedAcad ?? student.recentAverage) - targetPlan.baselineAcademic,
          completionNotes: noteText || 'Milestone review successfully completed.',
          completedAt: new Date().toISOString().slice(0, 10)
        };
      }
      updatedPlans[planIndex] = targetPlan;

      let newNotes = [...student.followUpNotes];
      if (noteText) {
        const note: FollowUpNote = {
          id: `fn-${Date.now()}`,
          planId,
          studentId: student.id,
          author: userRole === 'school_administrator' ? 'Administrator' : userRole === 'teacher' ? 'Class Teacher' : 'Support Specialist',
          date: new Date().toISOString().slice(0, 10),
          notes: noteText,
          observedAttendanceRate: observedAtt,
          observedAcademicScore: observedAcad,
          statusUpdate: newStatus
        };
        newNotes = [note, ...newNotes];
      }

      return {
        ...student,
        followUpStatus: newStatus,
        attendanceRate: observedAtt ?? student.attendanceRate,
        recentAverage: observedAcad ?? student.recentAverage,
        supportPlanHistory: updatedPlans,
        followUpNotes: newNotes
      };
    }));

    if (newStatus === 'completed') {
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
      addToast('success', 'Milestone Completed!', 'Support intervention successfully marked as completed.');
    } else {
      addToast('info', 'Status Updated', `Support plan status changed to ${newStatus.replace('_', ' ')}.`);
    }
  };

  const updateResourceCapacity = (resourceId: string, newCapacity: number) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, totalCapacity: newCapacity } : r));
    addToast('info', 'Resource Capacity Updated', 'School capacity configuration saved.');
  };

  const resetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setResources(INITIAL_SCHOOL_RESOURCES);
    localStorage.removeItem('udaan_students_v2');
    localStorage.removeItem('udaan_resources_v2');
    addToast('info', 'Demo Data Reset', 'Restored initial demonstration student records.');
  };

  return (
    <AppContext.Provider
      value={{
        students,
        resources,
        userRole,
        currentRoute,
        reportingPeriod,
        backendStatus,
        forceDemoMode,
        toasts,
        selectedStudentForLab,
        navigateTo,
        setUserRole,
        setReportingPeriod,
        setForceDemoMode,
        setSelectedStudentForLab,
        addStudent,
        updateStudent,
        importStudents,
        createSupportPlan,
        updateSupportPlanStatus,
        reassessStudentRisk,
        updateResourceCapacity,
        refreshBackendHealth,
        resetDemoData,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
