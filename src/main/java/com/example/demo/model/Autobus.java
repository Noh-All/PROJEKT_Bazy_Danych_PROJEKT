package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Autobusy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Autobus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_autobusu;

    @Column(nullable = false, unique = true, length = 10)
    private String numer_rejestracyjny;

    @Column(length = 50)
    private String model;

    @Column(nullable = false)
    private Integer liczba_miejsc;

    @Column(columnDefinition = "bus_status default 'Sprawny'")
    private String status;
}