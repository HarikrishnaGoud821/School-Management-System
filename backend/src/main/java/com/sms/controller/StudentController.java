package com.sms.controller;

import com.sms.dto.*;
import com.sms.entity.User;
import com.sms.repository.UserRepository;
import com.sms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final UserRepository userRepository;

    private Long currentUserId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentDto> getProfile(Authentication auth) {
        return ResponseEntity.ok(studentService.getProfile(currentUserId(auth)));
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentDto> updateProfile(Authentication auth, @RequestBody StudentDto dto) {
        return ResponseEntity.ok(studentService.updateProfile(currentUserId(auth), dto));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseDto>> getEnrolledCourses(Authentication auth) {
        return ResponseEntity.ok(studentService.getEnrolledCourses(currentUserId(auth)));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceDto>> getAttendance(Authentication auth) {
        return ResponseEntity.ok(studentService.getAttendance(currentUserId(auth)));
    }

    @GetMapping("/attendance/percentage")
    public ResponseEntity<Map<String, Double>> getAttendancePercentage(Authentication auth) {
        return ResponseEntity.ok(Map.of("percentage", studentService.getAttendancePercentage(currentUserId(auth))));
    }

    @GetMapping("/marks")
    public ResponseEntity<List<MarksDto>> getMarks(Authentication auth) {
        return ResponseEntity.ok(studentService.getMarks(currentUserId(auth)));
    }
}
