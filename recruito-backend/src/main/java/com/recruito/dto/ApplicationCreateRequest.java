package com.recruito.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationCreateRequest {
    @NotNull(message = "Job ID is required")
    private String jobId;
    
    private String coverLetter;
    private String resumeUrl;
}

