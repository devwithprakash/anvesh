import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCheckout, cancelSubscription } from './api';
import { subscriptionKeys } from './queries';

export function useCreateCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCheckout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.status });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.status });
    },
  });
}
