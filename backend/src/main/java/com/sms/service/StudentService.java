package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
    }

    public StudentDto getProfile(Long userId) {
        Student s = getStudentByUserId(userId);
        return StudentDto.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .name(s.getUser().getName())
                .email(s.getUser().getEmail())
                .phone(s.getUser().getPhone())
                .rollNumber(s.getRollNumber())
                .department(s.getDepartment())
                .year(s.getYear())
                .dateOfBirth(s.getDateOfBirth())
                .address(s.getAddress())
                .build();
    }

    public StudentDto updateProfile(Long userId, StudentDto dto) {
        Student student = getStudentByUserId(userId);
        User user = student.getUser();

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        if (dto.getAddress() != null) student.setAddress(dto.getAddress());
        if (dto.getDateOfBirth() != null) student.setDateOfBirth(dto.getDateOfBirth());
        studentRepository.save(student);

        return getProfile(userId);
    }

    public List<CourseDto> getEnrolledCourses(Long userId) {
        Student student = getStudentByUserId(userId);
        return enrollmentRepository.findByStudentId(student.getId()).stream()
                .map(Enrollment::getCourse)
                .map(c -> CourseDto.builder()
                        .id(c.getId())
                        .courseName(c.getCourseName())
                        .courseCode(c.getCourseCode())
                        .credits(c.getCredits())
                        .description(c.getDescription())
                        .teacherId(c.getTeacher() != null ? c.getTeacher().getId() : null)
                        .teacherName(c.getTeacher() != null ? c.getTeacher().getUser().getName() : null)
                        .build())
                .collect(Collectors.toList());
    }

    public List<AttendanceDto> getAttendance(Long userId) {
        Student student = getStudentByUserId(userId);
        return attendanceRepository.findByStudentId(student.getId()).stream()
                .map(a -> AttendanceDto.builder()
                        .id(a.getId())
                        .studentId(student.getId())
                        .studentName(student.getUser().getName())
                        .courseId(a.getCourse().getId())
                        .courseName(a.getCourse().getCourseName())
                        .date(a.getDate())
                        .status(a.getStatus().name())
                        .build())
                .collect(Collectors.toList());
    }

    public double getAttendancePercentage(Long userId) {
        List<AttendanceDto> records = getAttendance(userId);
        if (records.isEmpty()) return 0.0;
        long present = records.stream().filter(a -> "PRESENT".equals(a.getStatus())).count();
        return Math.round((present * 100.0 / records.size()) * 100.0) / 100.0;
    }

    public List<MarksDto> getMarks(Long userId) {
        Student student = getStudentByUserId(userId);
        return marksRepository.findByStudentId(student.getId()).stream()
                .map(m -> MarksDto.builder()
                        .id(m.getId())
                        .studentId(student.getId())
                        .studentName(student.getUser().getName())
                        .courseId(m.getCourse().getId())
                        .courseName(m.getCourse().getCourseName())
                        .examType(m.getExamType())
                        .marks(m.getMarks())
                        .maxMarks(m.getMaxMarks())
                        .grade(m.getGrade())
                        .build())
                .collect(Collectors.toList());
    }
}
