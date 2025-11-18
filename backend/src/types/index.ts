export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  created_at: string;
}

export interface Workshop {
  id: number;
  user_id: number;
  title: string;
  data: string; // JSON string
  current_step: number;
  is_completed: boolean;
  last_accessed: string;
  created_at: string;
  updated_at: string;
}

export interface WorkshopData {
  version: string;
  timestamp: string;
  data: {
    currentStep: number;
    customer: any;
    tools: any[];
    processes: any[];
    automationScenarios: any[];
    selectedPackage: string | null;
    hourlyRate: number;
    notes: string;
    actionItems: any[];
    history?: any[];
    historyIndex?: number;
  };
}

export interface AuthRequest extends Express.Request {
  userId?: number;
}
