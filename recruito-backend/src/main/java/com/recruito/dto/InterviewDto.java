package com.recruito.dto;

import com.recruito.model.enums.InterviewResponseStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewDto {
    private String id;
    private String applicationId;
    private String candidateId;
    private String candidateName;
    private String candidateEmail;
    private String recruiterId;
    private String recruiterName;
    private String recruiterEmail;
    private LocalDateTime scheduledAt;
    private LocalDateTime completedAt;
    private String notes;
    private String location;
    private String interviewType;
    private Boolean isCompleted;
    private LocalDateTime createdAt;
    private InterviewResponseStatus candidateResponseStatus;
    private LocalDateTime candidateRespondedAt;
    private String candidateResponseNote;
}

