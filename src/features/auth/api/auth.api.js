import { api } from "@/lib/api";

const BASE_PATH = "/internal/auth";

export const authApi = {
  login(payload) {
    return api.post(`${BASE_PATH}/login`, payload);
  },

  me(options = {}) {
    return api.get(`${BASE_PATH}/me`, options);
  },

  logout() {
    return api.post(`${BASE_PATH}/logout`);
  },
};