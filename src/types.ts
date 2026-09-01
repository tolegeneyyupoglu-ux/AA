export type RegionCode = 'TR' | 'US' | 'UK' | 'DE' | 'FR' | 'IT';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface ServiceAlternative {
  name: string;
  desc?: string;
  tag?: string;
  url: string;
}

export interface ServiceTier {
  id: string;
  name: string;
  monthlyCost: number;
  badge?: string;
  isPopular?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  domain: string;
  category: string;
  categoryLabel: string;
  region?: RegionCode;
  logoText?: string;
  logoBg?: string;
  difficulty: DifficultyLevel;
  difficultyLabel: string;
  timeToCancel: string;
  estMinutes?: number;
  avgMonthlyCost: number;
  currencySymbol: string;
  selectedTierId?: string;
  selectedTierName?: string;
  tiers?: ServiceTier[];
  trapAlert?: string;
  proTip?: string;
  steps: string[];
  directUrl?: string;
  directUrlLabel?: string;
  isGuideOnly?: boolean;
  disputePresetReasonId?: string;
  legalTip?: string;
  requiresLetterOrMail?: boolean;
  alternative?: ServiceAlternative;
}

export interface DisputeReason {
  id: string;
  label: string;
  legalClauseText: string;
}

export interface DisputeFormData {
  fullName: string;
  companyName: string;
  accountEmail: string;
  amountPaid: string;
  transactionDate: string;
  disputeReasonId: string;
  referenceNumber: string;
  customNotes?: string;
  userAddress?: string;
  userPhone?: string;
}

export interface RegionConfig {
  code: RegionCode;
  flag: string;
  name: string;
  brandName: string;
  domainBadge: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  currencyCode: string;
  disputeEngineTitle: string;
  disputeEngineSub: string;
  legalAuthorityBadge: string;
  defaultStatute: string;
  sampleAmounts: number[];
  disputeReasons: DisputeReason[];
  letterTemplate: (data: DisputeFormData, config: RegionConfig) => string;
}
