package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Trasy_Przystanki")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrasyPrzystanki {

    @EmbeddedId
    private TrasyPrzystankiKlucz id;

    @ManyToOne
    @MapsId("id_trasy")
    @JoinColumn(name = "id_trasy")
    private Trasa trasa;

    @ManyToOne
    @MapsId("id_przystanku")
    @JoinColumn(name = "id_przystanku")
    private Przystanek przystanek;

    @Column(nullable = false)
    private Integer kolejnosc;
}