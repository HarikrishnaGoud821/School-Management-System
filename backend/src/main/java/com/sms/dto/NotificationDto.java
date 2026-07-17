package com.sms.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class NotificationDto {
    private Long id;
    private String message;
    private Long userId;
    private LocalDateTime date;
    private boolean isRead;
}
