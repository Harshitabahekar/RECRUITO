package com.recruito.dto;

import com.recruito.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private Role role;
    private String userId;
    private String firstName;
    private String lastName;
}

