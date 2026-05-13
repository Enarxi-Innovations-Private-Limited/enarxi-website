import { db } from '../config/firebase.js';

/**
 * Get visitor statistics
 * @route   GET /api/stats
 * @access  Private (Admin)
 */
export const getVisitorStats = async (req, res) => {
  try {
    // 1. Get total visitors
    const totalDoc = await db.collection('stats').doc('visitors').get();
    const totalVisitors = totalDoc.exists ? totalDoc.data().total : 0;

    // 2. Get daily stats for the last 30 days
    const dailySnapshot = await db.collection('stats')
      .doc('daily')
      .collection('records')
      .orderBy('date', 'desc')
      .limit(30)
      .get();

    const dailyStats = [];
    dailySnapshot.forEach(doc => {
      dailyStats.push(doc.data());
    });

    // Sort by date ascending for the graph
    dailyStats.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      success: true,
      data: {
        totalVisitors,
        dailyStats
      }
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to fetch visitor statistics'
    });
  }
};
