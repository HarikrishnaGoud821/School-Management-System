package com.sms.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class AttendanceRequest {
    private Long studentId;
    private Long courseId;
    private LocalDate date;
    private String status;
}
