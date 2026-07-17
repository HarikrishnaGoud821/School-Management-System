package com.sms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "marks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "exam_type", nullable = false)
    private String examType; // e.g. MIDTERM, FINAL, QUIZ, ASSIGNMENT

    @Column(nullable = false)
    private Double marks;

    @Column(name = "max_marks")
    private Double maxMarks = 100.0;

    @Transient
    public String getGrade() {
        double pct = (marks / maxMarks) * 100;
        if (pct >= 90) return "A+";
        if (pct >= 80) return "A";
        if (pct >= 70) return "B";
        if (pct >= 60) return "C";
        if (pct >= 50) return "D";
        return "F";
    }
}
