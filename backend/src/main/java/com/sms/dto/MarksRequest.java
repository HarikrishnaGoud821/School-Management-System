package com.sms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarksRequest {
    private Long studentId;
    private Long courseId;
    private String examType;
    private Double marks;
    private Double maxMarks;
}
