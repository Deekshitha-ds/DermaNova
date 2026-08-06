import client from "./client";

export const registerUser = (payload) => client.post("/auth/register", payload);

export const loginUser = (payload) => client.post("/auth/login", payload);

export const requestPasswordReset = (email) =>
  client.post("/auth/reset-password/request", { email });

export const confirmPasswordReset = (payload) =>
  client.post("/auth/reset-password/confirm", payload);

export const getCurrentUser = () => client.get("/auth/me");

export const updateProfile = (payload) => client.put("/users/profile", payload);

export const uploadProfilePicture = (formData) =>
  client.post("/users/profile/picture", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
