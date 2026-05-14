package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Przystanki")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Przystanek {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_przystanku;

    @Column(nullable = false, length = 100)
    private String nazwa_miasta;

    @Column(length = 100)
    private String ulica;
}