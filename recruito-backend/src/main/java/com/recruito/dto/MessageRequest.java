package com.recruito.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MessageRequest {
    @NotNull(message = "Receiver email is required")
    @NotBlank(message = "Receiver email cannot be empty")
    @Email(message = "Receiver email must be a valid email address")
    private String receiverEmail;
    
    @NotBlank(message = "Message content is required")
    @Size(max = 10000, message = "Message content must not exceed 10000 characters")
    private String content;
}

