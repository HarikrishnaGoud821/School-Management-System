package com.sms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    private String role; // ADMIN, TEACHER, STUDENT

    private String phone;

    // Student specific
    private String rollNumber;
    private String department;
    private Integer year;

    // Teacher specific
    private String subject;
    private Integer experience;
    private String qualification;
}
