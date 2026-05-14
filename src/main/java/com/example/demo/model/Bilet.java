package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Bilety")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bilet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_biletu;

    @ManyToOne
    @JoinColumn(name = "id_kursu", nullable = false)
    private Kurs kurs;

    @ManyToOne
    @JoinColumn(name = "id_pasazera", nullable = false)
    private Uzytkownik pasazer;

    @Column(nullable = false)
    private Integer numer_miejsca;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cena_koncowa;

    @Column(columnDefinition = "ticket_status default 'Opłacony'")
    private String status_platnosci;

    @Column(nullable = false, unique = true)
    private String kod_qr;
}