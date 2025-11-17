package com.recruito.dto;

import com.recruito.model.enums.InterviewResponseStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InterviewResponseRequest {

    @NotNull(message = "Response status is required")
    private InterviewResponseStatus response;

    private String note;
}


