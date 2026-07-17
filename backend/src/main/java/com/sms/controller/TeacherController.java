package com.sms.controller;

import com.sms.dto.*;
import com.sms.entity.User;
import com.sms.repository.UserRepository;
import com.sms.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;
    private final UserRepository userRepository;

    private Long currentUserId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseDto>> getAssignedCourses(Authentication auth) {
        return ResponseEntity.ok(teacherService.getAssignedCourses(currentUserId(auth)));
    }

    @GetMapping("/courses/{courseId}/students")
    public ResponseEntity<List<StudentDto>> getStudentsInCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(teacherService.getStudentsInCourse(courseId));
    }

    @PostMapping("/attendance")
    public ResponseEntity<AttendanceDto> markAttendance(@RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(teacherService.markAttendance(request));
    }

    @GetMapping("/attendance/course/{courseId}")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(teacherService.getAttendanceByCourse(courseId));
    }

    @PostMapping("/marks")
    public ResponseEntity<MarksDto> enterMarks(@RequestBody MarksRequest request) {
        return ResponseEntity.ok(teacherService.enterMarks(request));
    }

    @PutMapping("/marks/{id}")
    public ResponseEntity<MarksDto> updateMarks(@PathVariable Long id, @RequestBody MarksRequest request) {
        return ResponseEntity.ok(teacherService.updateMarks(id, request));
    }

    @GetMapping("/marks/course/{courseId}")
    public ResponseEntity<List<MarksDto>> getMarksByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(teacherService.getMarksByCourse(courseId));
    }
}
