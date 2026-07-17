package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;

    // ---------- Dashboard ----------
    public DashboardStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalCourses = courseRepository.count();

        List<Attendance> allAttendance = attendanceRepository.findAll();
        double avgAttendance = 0;
        if (!allAttendance.isEmpty()) {
            long presentCount = allAttendance.stream()
                    .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                    .count();
            avgAttendance = (presentCount * 100.0) / allAttendance.size();
        }

        return DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalCourses(totalCourses)
                .averageAttendancePercentage(Math.round(avgAttendance * 100.0) / 100.0)
                .build();
    }

    // ---------- Students ----------
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream().map(this::toStudentDto).collect(Collectors.toList());
    }

    public StudentDto getStudentById(Long id) {
        Student s = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return toStudentDto(s);
    }

    public StudentDto updateStudent(Long id, StudentDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        User user = student.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        if (dto.getDepartment() != null) student.setDepartment(dto.getDepartment());
        if (dto.getYear() != null) student.setYear(dto.getYear());
        if (dto.getRollNumber() != null) student.setRollNumber(dto.getRollNumber());
        if (dto.getAddress() != null) student.setAddress(dto.getAddress());
        if (dto.getDateOfBirth() != null) student.setDateOfBirth(dto.getDateOfBirth());

        return toStudentDto(studentRepository.save(student));
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        Long userId = student.getUser().getId();
        studentRepository.delete(student);
        userRepository.deleteById(userId);
    }

    // ---------- Teachers ----------
    public List<TeacherDto> getAllTeachers() {
        return teacherRepository.findAll().stream().map(this::toTeacherDto).collect(Collectors.toList());
    }

    public TeacherDto getTeacherById(Long id) {
        Teacher t = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        return toTeacherDto(t);
    }

    public TeacherDto updateTeacher(Long id, TeacherDto dto) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        User user = teacher.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        if (dto.getSubject() != null) teacher.setSubject(dto.getSubject());
        if (dto.getExperience() != null) teacher.setExperience(dto.getExperience());
        if (dto.getQualification() != null) teacher.setQualification(dto.getQualification());

        return toTeacherDto(teacherRepository.save(teacher));
    }

    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        Long userId = teacher.getUser().getId();
        teacherRepository.delete(teacher);
        userRepository.deleteById(userId);
    }

    // ---------- Courses ----------
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream().map(this::toCourseDto).collect(Collectors.toList());
    }

    public CourseDto createCourse(CourseDto dto) {
        Course course = Course.builder()
                .courseName(dto.getCourseName())
                .courseCode(dto.getCourseCode())
                .credits(dto.getCredits())
                .description(dto.getDescription())
                .build();

        if (dto.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            course.setTeacher(teacher);
        }

        return toCourseDto(courseRepository.save(course));
    }

    public CourseDto updateCourse(Long id, CourseDto dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        if (dto.getCourseName() != null) course.setCourseName(dto.getCourseName());
        if (dto.getCourseCode() != null) course.setCourseCode(dto.getCourseCode());
        if (dto.getCredits() != null) course.setCredits(dto.getCredits());
        if (dto.getDescription() != null) course.setDescription(dto.getDescription());

        if (dto.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            course.setTeacher(teacher);
        }

        return toCourseDto(courseRepository.save(course));
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    public CourseDto assignTeacher(Long courseId, Long teacherId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        course.setTeacher(teacher);
        return toCourseDto(courseRepository.save(course));
    }

    public void enrollStudent(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).isPresent()) {
            throw new BadRequestException("Student already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder().student(student).course(course).build();
        enrollmentRepository.save(enrollment);
    }

    // ---------- Mapping helpers ----------
    private StudentDto toStudentDto(Student s) {
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

    private TeacherDto toTeacherDto(Teacher t) {
        return TeacherDto.builder()
                .id(t.getId())
                .userId(t.getUser().getId())
                .name(t.getUser().getName())
                .email(t.getUser().getEmail())
                .phone(t.getUser().getPhone())
                .subject(t.getSubject())
                .experience(t.getExperience())
                .qualification(t.getQualification())
                .build();
    }

    private CourseDto toCourseDto(Course c) {
        return CourseDto.builder()
                .id(c.getId())
                .courseName(c.getCourseName())
                .courseCode(c.getCourseCode())
                .credits(c.getCredits())
                .description(c.getDescription())
                .teacherId(c.getTeacher() != null ? c.getTeacher().getId() : null)
                .teacherName(c.getTeacher() != null ? c.getTeacher().getUser().getName() : null)
                .build();
    }
}
