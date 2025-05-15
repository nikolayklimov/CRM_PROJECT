export interface ManagerBonusInfo {
  managerId: string;
  name?: string;
  percent: number;
  sum: number;
}

export interface OwnerShare {
  ownerId: number;
  ownerName: string;
  amount: number;
}

export interface LeadBonusResult {
  amount: number;
  managers: ManagerBonusInfo[];
  totalManagerBonus: number;
  ownerModel: string;
  ownerShares: OwnerShare[];
}