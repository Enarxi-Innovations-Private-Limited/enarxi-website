import express from "express";
import { body, validationResult } from "express-validator";
import { db } from "../config/firebase.js";
import admin from "../config/firebase.js";
import { authenticateUser, requireAdmin } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import { retryBlog } from "../controllers/adminBlog.controller.js";
import { updateBlog } from "../controllers/userBlog.controller.js";

const router = express.Router();

/**
 * Helper function to extract public_id from Cloudinary URL
 */
function extractPublicId(url) {
  if (!url) return null;

  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) return null;

    const pathParts = parts.slice(uploadIndex + 2);
    const publicIdWithExt = pathParts.join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
}

/**
 * @route   DELETE /api/blogs/:blogId
 * @desc    Delete a blog and its associated images (Admin only)
 * @access  Private (Admin)
 */
router.delete("/:blogId", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!blogId) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Blog ID is required",
      });
    }

    // Get blog document to retrieve image URLs
    const blogDoc = await db.collection("blogs").doc(blogId).get();

    if (!blogDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Blog not found",
      });
    }

    const blogData = blogDoc.data();
    const deletedImages = [];
    const failedImages = [];

    // Delete associated images from Cloudinary
    if (blogData.images && Array.isArray(blogData.images)) {
      for (const image of blogData.images) {
        try {
          const imageUrl = typeof image === "string" ? image : image.url;
          const publicId = extractPublicId(imageUrl);

          if (publicId) {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result === "ok" || result.result === "not found") {
              deletedImages.push({
                url: imageUrl,
                publicId,
                result: result.result,
              });
            } else {
              failedImages.push({
                url: imageUrl,
                publicId,
                error: "Unexpected result",
              });
            }
          }
        } catch (error) {
          console.error("Error deleting image:", error);
          failedImages.push({ url: image, error: error.message });
        }
      }
    }

    // Delete blog document from Firestore
    await db.collection("blogs").doc(blogId).delete();

    // Log admin activity
    await db.collection("adminActivities").add({
      adminUid: req.user.uid,
      adminEmail: req.user.email,
      action: "deleted_blog",
      description: `Deleted blog: ${blogData.title || blogId}`,
      timestamp: new Date(),
      metadata: {
        blogId,
        blogTitle: blogData.title,
        imagesDeleted: deletedImages.length,
        imagesFailed: failedImages.length,
      },
    });

    res.json({
      success: true,
      message: "Blog deleted successfully",
      data: {
        blogId,
        blogTitle: blogData.title,
        imagesDeleted: deletedImages.length,
        imagesFailed: failedImages.length,
        deletedImages,
        failedImages,
      },
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message || "Failed to delete blog",
    });
  }
});

/**
 * @route   PUT /api/blogs/:blogId/approve
 * @desc    Approve a blog (Admin only)
 * @access  Private (Admin)
 */
router.put(
  "/:blogId/approve",
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      const { blogId } = req.params;

      if (!blogId) {
        return res.status(400).json({
          success: false,
          error: "Bad Request",
          message: "Blog ID is required",
        });
      }

      // Check if blog exists
      const blogDoc = await db.collection("blogs").doc(blogId).get();

      if (!blogDoc.exists) {
        return res.status(404).json({
          success: false,
          error: "Not Found",
          message: "Blog not found",
        });
      }

      // Update blog status to approved
      await db.collection("blogs").doc(blogId).update({
        status: "approved",
        approvedAt: new Date(),
        approvedBy: req.user.uid,
        updatedAt: new Date(),
      });

      const blogData = blogDoc.data();

      // Log admin activity
      await db.collection("adminActivities").add({
        adminUid: req.user.uid,
        adminEmail: req.user.email,
        action: "approved_blog",
        description: `Approved blog: ${blogData.title || blogId}`,
        timestamp: new Date(),
        metadata: { blogId, blogTitle: blogData.title },
      });

      res.json({
        success: true,
        message: "Blog approved successfully",
        data: { blogId, title: blogData.title },
      });
    } catch (error) {
      console.error("Error approving blog:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to approve blog",
      });
    }
  },
);

/**
 * @route   PUT /api/blogs/:blogId/reject
 * @desc    Reject a blog (Admin only)
 * @access  Private (Admin)
 */

router.put(
  "/:blogId/reject",
  authenticateUser,
  requireAdmin,
  [body("reason").optional().isString().withMessage("Reason must be a string")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const { blogId } = req.params;
      const { reason } = req.body;

      if (!blogId) {
        return res.status(400).json({
          success: false,
          error: "Bad Request",
          message: "Blog ID is required",
        });
      }

      // Check if blog exists
      const blogDoc = await db.collection("blogs").doc(blogId).get();

      if (!blogDoc.exists) {
        return res.status(404).json({
          success: false,
          error: "Not Found",
          message: "Blog not found",
        });
      }

      // Update blog status to rejected
      const updateData = {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedBy: req.user.uid,
        updatedAt: new Date(),
      };

      if (reason) {
        updateData.rejectionReason = reason;
      }

      await db.collection("blogs").doc(blogId).update(updateData);

      const blogData = blogDoc.data();

      // Log admin activity
      await db.collection("adminActivities").add({
        adminUid: req.user.uid,
        adminEmail: req.user.email,
        action: "rejected_blog",
        description: `Rejected blog: ${blogData.title || blogId}${reason ? ` - Reason: ${reason}` : ""}`,
        timestamp: new Date(),
        metadata: { blogId, blogTitle: blogData.title, reason },
      });

      res.json({
        success: true,
        message: "Blog rejected successfully",
        data: { blogId, title: blogData.title },
      });
    } catch (error) {
      console.error("Error rejecting blog:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to reject blog",
      });
    }
  },
);

/**
 * @route   PUT /api/blogs/:blogId/retry
 * @desc    Mark a blog as retry — staff must revise and resubmit (Admin only)
 * @access  Private (Admin)
 */

router.put(
  "/:blogId/retry",
  authenticateUser,
  requireAdmin,
  [
    body("feedback")
      .notEmpty()
      .withMessage("Feedback is required when requesting a retry")
      .isString()
      .withMessage("Feedback must be a string"),
  ],
  retryBlog, //calling adminBlogController where the logic will happen
);


router.put("/:blogId", authenticateUser, updateBlog);

/**
 * @route   POST /api/blogs/:blogId/view
 * @desc    Increment blog view count (Public)
 * @access  Public
 */
router.post("/:blogId/view", async (req, res) => {
  try {
    const { blogId } = req.params;
    const blogRef = db.collection("blogs").doc(blogId);

    // Get the current document to check if it exists
    const doc = await blogRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment views field
    await blogRef.update({
      views: admin.firestore.FieldValue.increment(1),
    });

    res.json({
      success: true,
      message: "View count incremented",
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to increment view count",
    });
  }
});

export default router;
