export type VerificationStatus = "Verified" | "Conflicting" | "Uncertain" | "Unsupported";

export interface ClaimSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface GroundedClaim {
  id: string;
  claim_text: string;
  sources: ClaimSource[];
  verification_status: VerificationStatus;
  verification_note: string;
}

export type AgentStage = 
  | "IDLE" 
  | "ORCHESTRATING" 
  | "RESEARCHING" 
  | "VERIFYING" 
  | "FEEDBACK_LOOP" 
  | "SYNTHESIZING" 
  | "COMPLETE" 
  | "ERROR";

export interface ExecutionTraceItem {
  timestamp: string;
  agent: string;
  stage: AgentStage;
  message: string;
  iteration: number;
  status?: string;
}

export interface AgentTelemetryEvent {
  id: string;
  timestamp: string;
  stage: AgentStage;
  active_step: number; // 0=idle, 1=orch, 2=research, 3=verifier, 4=decision, 5=complete
  agent: "Orchestrator" | "Researcher" | "Verifier" | "Decision Maker" | "System";
  status: string;
  message: string;
  iteration: number;
  payload?: {
    tasks?: Array<{ task_id: string; focus_area: string; search_query: string }>;
    task_id?: string;
    focus_area?: string;
    search_query?: string;
    claims_count?: number;
    claim?: { id: string; claim_text: string; sources_count: number; verification_status?: string };
    conflict_count?: number;
    uncertain_count?: number;
    verified_count?: number;
    iteration?: number;
    reason?: string;
    recommendation_preview?: string;
    confidence?: number;
  };
}

export interface DecisionResult {
  investigation_id: string;
  original_query: string;
  recommendation: string;
  confidence_score: number;
  model_assessed_confidence: number;
  primary_reasons: string[];
  facts: string[];
  inferences: string[];
  uncertainties: string[];
  evidence_items: GroundedClaim[];
  risks: string[];
  assumptions: string[];
  next_steps: string[];
  iterations_run: number;
  created_at: string;
  audit_metadata?: {
    model_name: string;
    grounding_mode: "live_google_search" | "parametric_grounded" | "curated_baseline";
    iterations_run: number;
    total_claims_analyzed: number;
    verified_claims_count: number;
    conflicting_claims_count: number;
    uncertain_claims_count: number;
    execution_trace: ExecutionTraceItem[];
  };
}

export interface PresetScenario {
  id: string;
  tag: string;
  domain: string;
  label: string;
  query: string;
  context: string;
}
