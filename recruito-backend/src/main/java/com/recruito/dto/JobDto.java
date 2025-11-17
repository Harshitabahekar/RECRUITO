package com.recruito.dto;

import com.recruito.model.enums.JobStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class JobDto {
    private String id;
    private String title;
    private String description;
    private String location;
    private String department;
    private String employmentType;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private JobStatus status;
    private String recruiterId;
    private String recruiterName;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    private Long applicationCount;
}

