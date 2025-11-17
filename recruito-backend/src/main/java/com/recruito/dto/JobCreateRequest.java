package com.recruito.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class JobCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String department;
    private String employmentType;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
}

