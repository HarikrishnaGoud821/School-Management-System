package com.sms.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StudentDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String rollNumber;
    private String department;
    private Integer year;
    private String dateOfBirth;
    private String address;
}
