package com.recruito.dto;

import lombok.Data;

import java.util.Map;

@Data
public class AnalyticsDto {
    private long totalJobs;
    private long totalApplications;
    private long totalInterviews;
    private long totalUsers;
    private long activeRecruiters;
    private long activeCandidates;
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> interviewsByMonth;
    private double conversionRate;
    private Map<String, Long> jobsByStatus;
}

