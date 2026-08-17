import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { authApi } from "./auth.api";

export const authKeys = {
  all: ["internal-auth"],
  me: () => [...authKeys.all, "me"],
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),

    queryFn: ({ signal }) =>
      authApi.me({
        signal,
      }),

    retry: false,

    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      authApi.login(payload),

    onSuccess: async () => {
      await queryClient.fetchQuery({
        queryKey: authKeys.me(),

        queryFn: () =>
          authApi.me(),
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      authApi.logout(),

    onSuccess: () => {
      queryClient.clear();
    },
  });
}