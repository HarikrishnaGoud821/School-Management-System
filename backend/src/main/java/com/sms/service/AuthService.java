package com.sms.service;

import com.sms.dto.AuthResponse;
import com.sms.dto.LoginRequest;
import com.sms.dto.SignupRequest;
import com.sms.entity.*;
import com.sms.exception.BadRequestException;
import com.sms.repository.StudentRepository;
import com.sms.repository.TeacherRepository;
import com.sms.repository.UserRepository;
import com.sms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Must be ADMIN, TEACHER, or STUDENT");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .phone(request.getPhone())
                .active(true)
                .build();
        user = userRepository.save(user);

        if (role == Role.STUDENT) {
            Student student = Student.builder()
                    .user(user)
                    .rollNumber(request.getRollNumber() != null ? request.getRollNumber() : "STU" + user.getId())
                    .department(request.getDepartment())
                    .year(request.getYear())
                    .build();
            studentRepository.save(student);
        } else if (role == Role.TEACHER) {
            Teacher teacher = Teacher.builder()
                    .user(user)
                    .subject(request.getSubject())
                    .experience(request.getExperience())
                    .qualification(request.getQualification())
                    .build();
            teacherRepository.save(teacher);
        }

        String token = jwtUtil.generateToken(
                userDetailsService.loadUserByUsername(user.getEmail()), user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
