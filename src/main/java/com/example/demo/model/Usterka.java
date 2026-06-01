package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usterki")
public class Usterka {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usterki;

    private Integer id_autobusu; // ID autobusu, który się zepsuł
    private String opis; // Np. "Zepsuta wycieraczka"
    private Boolean czy_naprawiona = false; // Domyślnie nowa usterka NIE jest naprawiona

    // --- Gettery i Settery ---
    public Integer getId_usterki() { return id_usterki; }
    public void setId_usterki(Integer id_usterki) { this.id_usterki = id_usterki; }

    public Integer getId_autobusu() { return id_autobusu; }
    public void setId_autobusu(Integer id_autobusu) { this.id_autobusu = id_autobusu; }

    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }

    public Boolean getCzy_naprawiona() { return czy_naprawiona; }
    public void setCzy_naprawiona(Boolean czy_naprawiona) { this.czy_naprawiona = czy_naprawiona; }
}