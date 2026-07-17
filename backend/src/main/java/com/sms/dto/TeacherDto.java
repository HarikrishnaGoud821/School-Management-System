package com.sms.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TeacherDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String subject;
    private Integer experience;
    private String qualification;
}
