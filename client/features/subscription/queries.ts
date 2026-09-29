import { useQuery } from '@tanstack/react-query';

import { getSubscriptionStatus, getPlans } from './api';

export const subscriptionKeys = {
  status: ['subscription'] as const,
  plans: ['plans'] as const,
};

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: subscriptionKeys.status,
    queryFn: getSubscriptionStatus,
    refetchOnWindowFocus: true,
  });
}

export function usePlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans,
    queryFn: getPlans,
    staleTime: 5 * 60 * 1000,
  });
}
