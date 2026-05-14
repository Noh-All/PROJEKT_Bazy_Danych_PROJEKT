package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Kursy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Kurs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_kursu;

    @ManyToOne
    @JoinColumn(name = "id_autobusu", nullable = false)
    private Autobus autobus;

    @ManyToOne
    @JoinColumn(name = "id_trasy", nullable = false)
    private Trasa trasa;

    @ManyToOne
    @JoinColumn(name = "id_kierowcy", nullable = false)
    private Uzytkownik kierowca;

    @Column(nullable = false)
    private LocalDateTime data_odjazdu;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cena_bazowa;
}