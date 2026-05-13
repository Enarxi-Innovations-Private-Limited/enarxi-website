import { auth } from "./firebase";

// Backend API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Get the current user's ID token for authentication
 */
async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  return await user.getIdToken();
}

/**
 * Make an authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const token = await getAuthToken();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

/**
 * Make a public API request (no authentication required)
 */
async function publicRequest(endpoint, options = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Public API request failed");
    }

    return data;
  } catch (error) {
    console.error("Public API request error:", error);
    throw error;
  }
}

// ============================================================================
// USER MANAGEMENT APIs
// ============================================================================

/**
 * Delete a user (Admin only)
 */
export async function deleteUser(uid) {
  return await apiRequest(`/users/${uid}`, {
    method: "DELETE",
  });
}

/**
 * Update user email (Admin only)
 */
export async function updateUserEmail(uid, email) {
  return await apiRequest(`/users/${uid}/email`, {
    method: "PUT",
    body: JSON.stringify({ email }),
  });
}

/**
 * Update user password (Admin only)
 */
export async function updateUserPassword(uid, password) {
  return await apiRequest(`/users/${uid}/password`, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
}

/**
 * Update user profile (Admin only)
 */
export async function updateUserProfile(uid, data) {
  return await apiRequest(`/users/${uid}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============================================================================
// CLOUDINARY APIs
// ============================================================================

/**
 * Delete image from Cloudinary by public ID (Admin only)
 */
export async function deleteCloudinaryImage(publicId) {
  return await apiRequest("/cloudinary/delete", {
    method: "POST",
    body: JSON.stringify({ publicId }),
  });
}

/**
 * Delete image from Cloudinary by URL (Admin only)
 */
export async function deleteCloudinaryImageByUrl(url) {
  return await apiRequest("/cloudinary/delete-by-url", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

/**
 * Delete multiple images from Cloudinary (Admin only)
 */
export async function deleteMultipleCloudinaryImages(publicIds) {
  return await apiRequest("/cloudinary/delete-multiple", {
    method: "POST",
    body: JSON.stringify({ publicIds }),
  });
}

// ============================================================================
// BLOG APIs
// ============================================================================

/**
 * Delete a blog and its associated images (Admin only)
 */
export async function deleteBlog(blogId) {
  return await apiRequest(`/blogs/${blogId}`, {
    method: "DELETE",
  });
}

/**
 * Approve a blog (Admin only)
 */
export async function approveBlog(blogId) {
  return await apiRequest(`/blogs/${blogId}/approve`, {
    method: "PUT",
  });
}

/**
 * Reject a blog (Admin only)
 */
export async function rejectBlog(blogId, reason = null) {
  return await apiRequest(`/blogs/${blogId}/reject`, {
    method: "PUT",   
    body: JSON.stringify({ reason }),
  });
}

// Retry a blog (Admin only)
export async function retryBlog(blogId, feedback) {
  return await apiRequest(`/blogs/${blogId}/retry`, {
    method: "PUT",
    body: JSON.stringify({ feedback }),
  });
}

//Edit the retry blog (Satff)
export async function updateBlog(blogId, data) {
  return await apiRequest(`/blogs/${blogId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Increment blog view count (Public)
 */
export async function incrementBlogViews(blogId) {
  return await publicRequest(`/blogs/${blogId}/view`, {
    method: "POST",
  });
}

// ============================================================================
// STATS APIs
// ============================================================================

/**
 * Get visitor statistics (Admin only)
 */
export async function getVisitorStats() {
  return await apiRequest("/stats");
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check backend API health
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL.replace("/api", "")}/health`);
    return await response.json();
  } catch (error) {
    console.error("Health check failed:", error);
    throw error;
  }
}
