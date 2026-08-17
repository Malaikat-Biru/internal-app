import { api } from "@/lib/api";

const BASE_PATH = "/internal/maps";

export const mapsApi = {
  getAll({
    page = 1,
    limit = 20,
    world = "",
    search = "",
    signal,
  } = {}) {
    return api.get(BASE_PATH, {
      params: {
        page,
        limit,
        world,
        search,
      },
      signal,
    });
  },

  getStatistics(options = {}) {
    return api.get(
      `${BASE_PATH}/statistics`,
      options,
    );
  },

  getById(
    id,
    options = {},
  ) {
    return api.get(
      `${BASE_PATH}/${id}`,
      options,
    );
  },

  create(formData) {
    return api.post(
      BASE_PATH,
      formData,
    );
  },

  update(
    id,
    formData,
  ) {
    return api.patch(
      `${BASE_PATH}/${id}`,
      formData,
    );
  },

  delete(id) {
    return api.delete(
      `${BASE_PATH}/${id}`,
    );
  },
};