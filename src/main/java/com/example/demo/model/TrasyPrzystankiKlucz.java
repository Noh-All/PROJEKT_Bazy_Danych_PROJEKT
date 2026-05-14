package com.example.demo.model;

import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TrasyPrzystankiKlucz implements Serializable {

    private Integer id_trasy;
    private Integer id_przystanku;

}