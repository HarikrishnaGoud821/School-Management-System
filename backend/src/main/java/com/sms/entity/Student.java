package com.sms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;

    @Column(name = "roll_number", unique = true)
    private String rollNumber;

    private String department;

    private Integer year;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    private String address;
}
