package com.sms.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CourseDto {
    private Long id;
    private String courseName;
    private String courseCode;
    private Integer credits;
    private String description;
    private Long teacherId;
    private String teacherName;
}
