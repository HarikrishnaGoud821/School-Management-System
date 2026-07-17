package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public Teacher getTeacherByUserId(Long userId) {
        return teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found"));
    }

    public List<CourseDto> getAssignedCourses(Long teacherUserId) {
        Teacher teacher = getTeacherByUserId(teacherUserId);
        return courseRepository.findByTeacherId(teacher.getId()).stream()
                .map(c -> CourseDto.builder()
                        .id(c.getId())
                        .courseName(c.getCourseName())
                        .courseCode(c.getCourseCode())
                        .credits(c.getCredits())
                        .description(c.getDescription())
                        .teacherId(teacher.getId())
                        .teacherName(teacher.getUser().getName())
                        .build())
                .collect(Collectors.toList());
    }

    public List<StudentDto> getStudentsInCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId).stream()
                .map(Enrollment::getStudent)
                .map(s -> StudentDto.builder()
                        .id(s.getId())
                        .userId(s.getUser().getId())
                        .name(s.getUser().getName())
                        .email(s.getUser().getEmail())
                        .rollNumber(s.getRollNumber())
                        .department(s.getDepartment())
                        .year(s.getYear())
                        .build())
                .collect(Collectors.toList());
    }

    public AttendanceDto markAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Attendance.AttendanceStatus status;
        try {
            status = Attendance.AttendanceStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid attendance status. Use PRESENT, ABSENT, or LATE");
        }

        Attendance attendance = Attendance.builder()
                .student(student)
                .course(course)
                .date(request.getDate())
                .status(status)
                .build();
        attendance = attendanceRepository.save(attendance);

        return toAttendanceDto(attendance);
    }

    public List<AttendanceDto> getAttendanceByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId).stream()
                .flatMap(e -> attendanceRepository.findByStudentIdAndCourseId(e.getStudent().getId(), courseId).stream())
                .map(this::toAttendanceDto)
                .collect(Collectors.toList());
    }

    public MarksDto enterMarks(MarksRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Marks marks = Marks.builder()
                .student(student)
                .course(course)
                .examType(request.getExamType())
                .marks(request.getMarks())
                .maxMarks(request.getMaxMarks() != null ? request.getMaxMarks() : 100.0)
                .build();
        marks = marksRepository.save(marks);

        return toMarksDto(marks);
    }

    public MarksDto updateMarks(Long marksId, MarksRequest request) {
        Marks marks = marksRepository.findById(marksId)
                .orElseThrow(() -> new ResourceNotFoundException("Marks record not found"));

        if (request.getMarks() != null) marks.setMarks(request.getMarks());
        if (request.getMaxMarks() != null) marks.setMaxMarks(request.getMaxMarks());
        if (request.getExamType() != null) marks.setExamType(request.getExamType());

        return toMarksDto(marksRepository.save(marks));
    }

    public List<MarksDto> getMarksByCourse(Long courseId) {
        return marksRepository.findByCourseId(courseId).stream()
                .map(this::toMarksDto)
                .collect(Collectors.toList());
    }

    private AttendanceDto toAttendanceDto(Attendance a) {
        return AttendanceDto.builder()
                .id(a.getId())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getUser().getName())
                .courseId(a.getCourse().getId())
                .courseName(a.getCourse().getCourseName())
                .date(a.getDate())
                .status(a.getStatus().name())
                .build();
    }

    private MarksDto toMarksDto(Marks m) {
        return MarksDto.builder()
                .id(m.getId())
                .studentId(m.getStudent().getId())
                .studentName(m.getStudent().getUser().getName())
                .courseId(m.getCourse().getId())
                .courseName(m.getCourse().getCourseName())
                .examType(m.getExamType())
                .marks(m.getMarks())
                .maxMarks(m.getMaxMarks())
                .grade(m.getGrade())
                .build();
    }
}
