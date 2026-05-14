package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Trasy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Trasa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_trasy;

    @Column(length = 50)
    private String nazwa_linii;

    @ManyToOne
    @JoinColumn(name = "id_przystanku_start")
    private Przystanek przystanekStart;

    @ManyToOne
    @JoinColumn(name = "id_przystanku_koniec")
    private Przystanek przystanekKoniec;
}