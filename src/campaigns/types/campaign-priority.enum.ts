export enum CampaignPriority {
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
}

// lower number = high priority
export const PRIORITY_VALUES: Record<CampaignPriority, number> = {
  [CampaignPriority.HIGH]: 1,
  [CampaignPriority.NORMAL]: 5,
  [CampaignPriority.LOW]: 10,
};
