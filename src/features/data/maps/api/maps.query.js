import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { mapsApi } from "./maps.api";

export const mapKeys = {
  all: ["maps"],

  lists: () => [
    ...mapKeys.all,
    "list",
  ],

  list: (params) => [
    ...mapKeys.lists(),
    params,
  ],

  details: () => [
    ...mapKeys.all,
    "detail",
  ],

  detail: (id) => [
    ...mapKeys.details(),
    id,
  ],

  statistics: () => [
    ...mapKeys.all,
    "statistics",
  ],
};

export function useMaps(
  params = {},
) {
  return useQuery({
    queryKey:
      mapKeys.list(
        params,
      ),

    queryFn: ({
      signal,
    }) =>
      mapsApi.getAll({
        ...params,
        signal,
      }),

    placeholderData:
      keepPreviousData,
  });
}

export function useMapStatistics() {
  return useQuery({
    queryKey:
      mapKeys.statistics(),

    queryFn: ({
      signal,
    }) =>
      mapsApi.getStatistics({
        signal,
      }),
  });
}

export function useMapDetail(
  id,
) {
  return useQuery({
    queryKey:
      mapKeys.detail(
        id,
      ),

    queryFn: ({
      signal,
    }) =>
      mapsApi.getById(
        id,
        {
          signal,
        },
      ),

    enabled:
      Boolean(id),
  });
}

export function useCreateMap() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      formData,
    ) =>
      mapsApi.create(
        formData,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            mapKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            mapKeys.statistics(),
        }),
      ]);
    },
  });
}

export function useUpdateMap() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }) =>
      mapsApi.update(
        id,
        formData,
      ),

    onSuccess: async (
      _response,
      variables,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            mapKeys.detail(
              variables.id,
            ),
        }),

        queryClient.invalidateQueries({
          queryKey:
            mapKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            mapKeys.statistics(),
        }),
      ]);
    },
  });
}

export function useDeleteMap() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      mapsApi.delete(id),

    onSuccess: async (
      _response,
      id,
    ) => {
      /*
       * Hapus cache detail map
       * yang sudah di-delete.
       */
      queryClient.removeQueries({
        queryKey:
          mapKeys.detail(
            id,
          ),
      });

      /*
       * Refresh list dan statistik.
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            mapKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            mapKeys.statistics(),
        }),
      ]);
    },
  });
}