package com.recruito.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewCreateRequest {
    @NotNull(message = "Application ID is required")
    private String applicationId;
    
    @NotNull(message = "Scheduled time is required")
    @Future(message = "Scheduled time must be in the future")
    private LocalDateTime scheduledAt;
    
    private String location;
    private String interviewType;
    private String notes;
}

