package com.example.demo.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "drivers")
@Getter @Setter
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String licenseNumber;
    private String status; // np. "AVAILABLE", "ON_ROUTE", "SICK_LEAVE"
}