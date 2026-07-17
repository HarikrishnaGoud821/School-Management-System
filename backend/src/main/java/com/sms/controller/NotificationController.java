package com.sms.controller;

import com.sms.dto.ApiResponse;
import com.sms.dto.NotificationDto;
import com.sms.entity.User;
import com.sms.repository.UserRepository;
import com.sms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getMyNotifications(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(notificationService.getNotificationsForUser(user.getId()));
    }

    @PostMapping
    public ResponseEntity<NotificationDto> create(@RequestBody Map<String, Object> body) {
        String message = (String) body.get("message");
        Long userId = body.get("userId") != null ? Long.valueOf(body.get("userId").toString()) : null;
        return ResponseEntity.ok(notificationService.createNotification(message, userId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Marked as read").build());
    }
}
