package com.sms.controller;

import com.sms.dto.*;
import com.sms.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ---- Students ----
    @GetMapping("/students")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentDto> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getStudentById(id));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id, @RequestBody StudentDto dto) {
        return ResponseEntity.ok(adminService.updateStudent(id, dto));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<ApiResponse> deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Student deleted successfully").build());
    }

    // ---- Teachers ----
    @GetMapping("/teachers")
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        return ResponseEntity.ok(adminService.getAllTeachers());
    }

    @GetMapping("/teachers/{id}")
    public ResponseEntity<TeacherDto> getTeacher(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getTeacherById(id));
    }

    @PutMapping("/teachers/{id}")
    public ResponseEntity<TeacherDto> updateTeacher(@PathVariable Long id, @RequestBody TeacherDto dto) {
        return ResponseEntity.ok(adminService.updateTeacher(id, dto));
    }

    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<ApiResponse> deleteTeacher(@PathVariable Long id) {
        adminService.deleteTeacher(id);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Teacher deleted successfully").build());
    }

    // ---- Courses ----
    @GetMapping("/courses")
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        return ResponseEntity.ok(adminService.getAllCourses());
    }

    @PostMapping("/courses")
    public ResponseEntity<CourseDto> createCourse(@RequestBody CourseDto dto) {
        return ResponseEntity.ok(adminService.createCourse(dto));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable Long id, @RequestBody CourseDto dto) {
        return ResponseEntity.ok(adminService.updateCourse(id, dto));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<ApiResponse> deleteCourse(@PathVariable Long id) {
        adminService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Course deleted successfully").build());
    }

    @PostMapping("/courses/{courseId}/assign-teacher/{teacherId}")
    public ResponseEntity<CourseDto> assignTeacher(@PathVariable Long courseId, @PathVariable Long teacherId) {
        return ResponseEntity.ok(adminService.assignTeacher(courseId, teacherId));
    }

    @PostMapping("/enroll")
    public ResponseEntity<ApiResponse> enrollStudent(@RequestBody Map<String, Long> body) {
        adminService.enrollStudent(body.get("studentId"), body.get("courseId"));
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Student enrolled successfully").build());
    }
}
