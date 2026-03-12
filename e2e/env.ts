export const env = {
  baseURL: process.env["E2E_URL"] ?? "http://localhost:3000",
  routes: {
    home: "/",
    submit: "/submit",
    admin: "/admin",
    login: "/auth/login",
    podcasts: "/podcasts",
  },
};
