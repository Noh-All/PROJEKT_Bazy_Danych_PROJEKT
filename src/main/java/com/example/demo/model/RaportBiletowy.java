package com.example.demo.model;

import java.math.BigDecimal;

public class RaportBiletowy {

    private Long liczbaBiletow;
    private BigDecimal sumaZarobkow; // Zmiana na BigDecimal!

    // --- Gettery i Settery ---
    public Long getLiczbaBiletow() { return liczbaBiletow; }
    public void setLiczbaBiletow(Long liczbaBiletow) { this.liczbaBiletow = liczbaBiletow; }

    public BigDecimal getSumaZarobkow() { return sumaZarobkow; }
    public void setSumaZarobkow(BigDecimal sumaZarobkow) { this.sumaZarobkow = sumaZarobkow; }
}