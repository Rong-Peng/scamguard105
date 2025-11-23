export enum RiskLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  DANGEROUS = 'DANGEROUS',
  CRITICAL = 'CRITICAL'
}

export interface VerificationStrategy {
  type: string; // e.g. "Feigned Incompetence"
  explanation: string; // Why this works
  reply: string; // The message to send
  expectedReaction: string; // What to look for
}

export interface AnalysisResult {
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  summary: string;
  generatedConversation?: string; // Content of the simulated chat if requested
  scammerMotive: string;
  expectedOutcome: string;
  redFlags: string[];
  psychologicalTactics: string[];
  verificationStrategies: VerificationStrategy[];
  actionableAdvice: string;
  scamAlertMessage?: string; // A direct warning message to the victim
}

export interface ChatInput {
  text: string;
  images: File[];
}