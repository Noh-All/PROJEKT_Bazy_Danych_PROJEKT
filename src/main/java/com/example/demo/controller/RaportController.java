package com.example.demo.controller;

import com.example.demo.model.RaportBiletowy;
import com.example.demo.repository.BiletRepository;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/raporty")
@CrossOrigin(origins = "*")
public class RaportController {

    private final BiletRepository biletRepository;

    public RaportController(BiletRepository biletRepository) {
        this.biletRepository = biletRepository;
    }

    @GetMapping("/podsumowanie")
    public RaportBiletowy pobierzPodsumowanie() {
        RaportBiletowy raport = new RaportBiletowy();
        raport.setLiczbaBiletow(biletRepository.count());
        BigDecimal suma = biletRepository.zsumujCalkowityPrzychod();
        raport.setSumaZarobkow(suma != null ? suma : BigDecimal.ZERO);
        return raport;
    }

    // --- NOWY ENDPOINT: Wysyła szczegółowe dane do nowej tabelki w Reactcie ---
    @GetMapping("/trasy")
    public List<Map<String, Object>> pobierzRaportTras() {
        return biletRepository.raportDlaPojedynczychTras();
    }
}