package com.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalStudents;
    private long totalTeachers;
    private long totalCourses;
    private double averageAttendancePercentage;
}
