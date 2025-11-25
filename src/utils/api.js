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
export async function loginUser(identifier, password) {
  try {
    const res = await api.post("/auth/login", { identifier, password });
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

/**
 * Forgot Password
 * ------------------------------------------------------
 * Sends a password reset link to user's email
 *
 * @param {string} email
 * @returns {Object} response data
 */
export async function forgotPassword(email) {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (err) {
    return (
      err.response?.data || {
        success: false,
        message: "Error sending password reset email",
      }
    );
  }
}

/**
 * Reset Password
 * ------------------------------------------------------
 * Resets user password using token sent via email
 *
 * @param {string} token - reset token from URL
 * @param {string} newPassword - new user password
 * @returns {Object} response data
 */
export async function resetPassword(token, newPassword) {
  try {
    const res = await api.post("/auth/reset-password", { token, newPassword });
    return res.data;
  } catch (err) {
    return (
      err.response?.data || {
        success: false,
        message: "Error resetting password",
      }
    );
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
// -------- DASHBOARD --------
//

// Get dashboard statistics
export async function getDashboardStats() {
  try {
    const [medicinesRes, usersRes] = await Promise.all([
      api.get("/medicines"),
      api.get("/admin/users"),
    ]);

    const medicines = medicinesRes.data?.data || [];
    const users = usersRes.data?.data || [];


    const expiringSoon = medicines.filter((m) => {
      const daysLeft =
        (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
      return daysLeft > 0 && daysLeft <= 30;
    });

    return {
      totalMedicines: medicines.length,
      activeUsers: users.length,
      expiringSoonCount: expiringSoon.length,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Get medicines expiring in 30 days
export async function getExpiringSoonMedicines() {
  try {
    const res = await api.get("/medicines");
    const medicines = res.data?.data || [];

    return medicines
      .map((m) => {
        const daysLeft =
          (new Date(m.expiryDate) - new Date()) /
          (1000 * 60 * 60 * 24);
        return { ...m, daysLeft: Math.ceil(daysLeft) };
      })
      .filter((m) => m.daysLeft > 0 && m.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  } catch (err) {
    return [];
  }
}

// Get top 5 medicines by stock (for charts)
export async function getTopStockMedicines() {
  try {
    const res = await api.get("/medicines");
    const medicines = res.data?.data || [];

    return medicines
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  } catch (err) {
    return [];
  }
}

export async function getRecentActivities() {
  try {
    const res = await api.get("/admin/recent-activities");
    return res.data?.data || [];
  } catch (err) {
    return [];
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
    const res = await api.post("/auth/admin/create-user", user); // ADMIN CREATE USER
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
