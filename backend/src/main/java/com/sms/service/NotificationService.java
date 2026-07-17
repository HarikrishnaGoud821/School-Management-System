package com.sms.service;

import com.sms.dto.NotificationDto;
import com.sms.entity.Notification;
import com.sms.entity.User;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.NotificationRepository;
import com.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationDto> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrUserIsNullOrderByDateDesc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public NotificationDto createNotification(String message, Long userId) {
        Notification.NotificationBuilder builder = Notification.builder().message(message);
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            builder.user(user);
        }
        Notification notification = notificationRepository.save(builder.build());
        return toDto(notification);
    }

    public void markAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        n.setRead(true);
        notificationRepository.save(n);
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .message(n.getMessage())
                .userId(n.getUser() != null ? n.getUser().getId() : null)
                .date(n.getDate())
                .isRead(n.isRead())
                .build();
    }
}
