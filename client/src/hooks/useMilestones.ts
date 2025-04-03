import { useState, useEffect } from 'react';

type MilestoneType = 'referrals' | 'earnings' | 'balance';

export interface Milestone {
  type: MilestoneType;
  amount: number;
  title: string;
  description: string;
}

interface UseMilestonesProps {
  referrals: number;
  earnings: number;
  balance: number;
  previousReferrals?: number;
  previousEarnings?: number;
  previousBalance?: number;
}

export function useMilestones({
  referrals,
  earnings,
  balance,
  previousReferrals = 0,
  previousEarnings = 0,
  previousBalance = 0
}: UseMilestonesProps) {
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    // Define milestone thresholds
    const referralMilestones = [1, 5, 10, 20, 50, 100];
    const earningsMilestones = [1000, 5000, 10000, 20000, 50000, 100000];
    const balanceMilestones = [1000, 5000, 10000, 20000, 50000, 100000];

    // Check for referral milestones
    for (const milestone of referralMilestones) {
      if (previousReferrals < milestone && referrals >= milestone) {
        setActiveMilestone({
          type: 'referrals',
          amount: milestone,
          title: `${milestone} Referrals Milestone!`,
          description: `You've reached ${milestone} referrals! Keep inviting friends to earn more.`
        });
        return;
      }
    }

    // Check for earnings milestones
    for (const milestone of earningsMilestones) {
      if (previousEarnings < milestone && earnings >= milestone) {
        setActiveMilestone({
          type: 'earnings',
          amount: milestone,
          title: `₦${milestone.toLocaleString()} Earnings Milestone!`,
          description: `You've earned a total of ₦${milestone.toLocaleString()}! Great job!`
        });
        return;
      }
    }

    // Check for balance milestones
    for (const milestone of balanceMilestones) {
      if (previousBalance < milestone && balance >= milestone) {
        setActiveMilestone({
          type: 'balance',
          amount: milestone,
          title: `₦${milestone.toLocaleString()} Balance Milestone!`,
          description: `Your balance has reached ₦${milestone.toLocaleString()}!`
        });
        return;
      }
    }
  }, [referrals, earnings, balance, previousReferrals, previousEarnings, previousBalance]);

  // Function to clear the active milestone
  const clearActiveMilestone = () => {
    setActiveMilestone(null);
  };

  return {
    activeMilestone,
    clearActiveMilestone
  };
}