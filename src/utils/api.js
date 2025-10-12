import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true, // if backend uses cookies
});

// Attach token from localStorage automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

//
// -------- AUTH --------
//
export async function loginUser(email, password) {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false, message: "Network error" };
  }
}

export async function registerUser(username, email, password, role = "staff") {
  try {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
      role,
    });
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false, message: "Network error" };
  }
}

//
// -------- MEDICINES --------
//
export async function getMedicines() {
  try {
    const res = await api.get("/medicines");
    return res.data;
  } catch (err) {
    return { success: false, message: "Error fetching medicines" };
  }
}

export async function addMedicine(medicine) {
  try {
    const res = await api.post("/medicines", medicine);
    return res.data;
  } catch (err) {
    return { success: false, message: "Error adding medicine" };
  }
}

export async function updateMedicine(id, updates) {
  try {
    const res = await api.put(`/medicines/${id}`, updates);
    return res.data;
  } catch (err) {
    return { success: false, message: "Error updating medicine" };
  }
}

export async function deleteMedicine(id) {
  try {
    const res = await api.delete(`/medicines/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: "Error deleting medicine" };
  }
}

//
// -------- USERS --------
//
export async function getUsers() {
  try {
    const res = await api.get("/admin/users");
    return res.data;
  } catch (err) {
    return { success: false, message: "Error fetching users" };
  }
}

export async function addUser(user) {
  try {
    const res = await api.post("/auth/register", user);
    return res.data;
  } catch (err) {
    return { success: false, message: "Error adding user" };
  }
}

export async function updateUser(id, updates) {
  try {
    const res = await api.put(`/auth/users/${id}`, updates);
    return res.data;
  } catch (err) {
    return { success: false, message: "Error updating user" };
  }
}

export async function deleteUser(id) {
  try {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: "Error deleting user" };
  }
}

export default api;
