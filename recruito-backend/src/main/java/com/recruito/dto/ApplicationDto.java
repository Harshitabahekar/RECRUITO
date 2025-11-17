package com.recruito.dto;

import com.recruito.model.enums.ApplicationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApplicationDto {
    private String id;
    private String jobId;
    private String jobTitle;
    private String candidateId;
    private String candidateName;
    private String candidateEmail;
    private ApplicationStatus status;
    private String coverLetter;
    private String resumeUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

