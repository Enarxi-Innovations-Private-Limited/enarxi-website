"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStats } from '@/hooks/useAdminStats';
import DashboardStatsView from "../presentational/DashboardStatsView";

const DashboardStatsContainer = () => {
  const navigate = useNavigate();
  const { stats, visitorData, recentActivities, loading, statsLoading } = useAdminStats();
  const [viewPeriod, setViewPeriod] = useState("daily");

  const getFilteredVisitorData = () => {
    if (viewPeriod === "daily") return visitorData;

    if (viewPeriod === "weekly") {
      const grouped = [];
      for (let i = 0; i < visitorData.length; i += 7) {
        const chunk = visitorData.slice(i, i + 7);
        const total = chunk.reduce((sum, item) => sum + item.count, 0);
        grouped.push({
          date: chunk[0].date,
          count: total,
          isWeekly: true
        });
      }
      return grouped;
    }

    if (viewPeriod === "monthly") {
      const months = {};
      visitorData.forEach(item => {
        const month = item.date.substring(0, 7);
        if (!months[month]) months[month] = 0;
        months[month] += item.count;
      });
      return Object.keys(months).map(m => ({
        date: `${m}-01`,
        count: months[m],
        isMonthly: true
      })).sort((a, b) => a.date.localeCompare(b.date));
    }

    return visitorData;
  };

  return (
    <DashboardStatsView
      stats={stats}
      recentActivities={recentActivities}
      loading={loading}
      statsLoading={statsLoading}
      viewPeriod={viewPeriod}
      setViewPeriod={setViewPeriod}
      filteredVisitorData={getFilteredVisitorData()}
      onNavigate={navigate}
    />
  );
};

export default DashboardStatsContainer;
