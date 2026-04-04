import { validationResult } from "express-validator";
import { db } from "../config/firebase.js"


export const retryBlog = async (req, res) => {
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
    const { feedback } = req.body;

    if (!blogId) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Blog Id is required",
      });
    }

    //check if the blog exist
    const blogDoc = await db.collection("blogs").doc(blogId).get();

    if (!blogDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Blog not found",
      });
    }

    const blogData = blogDoc.data();

    // Only blogs that are pending approval can be sent for retry
    const currentStatus = blogData.status || "pending"; //old blog data does not have the status filed
    if (currentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: `Blog cannot be retried from its current status: "${currentStatus}". Only pending blogs can be sent for retry.`,
      });
    }

    // Update blog status to retry
    await db.collection("blogs").doc(blogId).update({
      status: "retry",
      retryAt: new Date(),
      retryBy: req.user.uid,
      retryFeedback: feedback,
      updatedAt: new Date(),
    });

    // Log admin activity
    await db.collection("adminActivities").add({
      adminUid: req.user.uid,
      adminEmail: req.user.email,
      action: "retried_blog",
      description: `Requested retry for blog: ${blogData.title || blogId} - Feedback: ${feedback}`,
      timestamp: new Date(),
      metadata: { blogId, blogTitle: blogData.title, feedback },
    });

    res.json({
      success: true,
      message:
        "Blog marked for retry. Staff has been notified to revise and resubmit.",
      data: {
        blogId,
        title: blogData.title,
        status: "retry",
        feedback,
      },
    });

  }
  //error catching
  catch (error) {
    console.error("Error marking blog for retry:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message || "Failed to mark blog for retry",
    });
  }
};
