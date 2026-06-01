package com.example.demo.controller;

import com.example.demo.model.RaportBiletowy;
import com.example.demo.repository.BiletRepository;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/raporty")
@CrossOrigin(origins = "http://localhost:5173") // Przepustka dla Marcina!
public class RaportController {

    private final BiletRepository biletRepository;

    public RaportController(BiletRepository biletRepository) {
        this.biletRepository = biletRepository;
    }

    @GetMapping("/podsumowanie")
    public RaportBiletowy pobierzPodsumowanie() {
        RaportBiletowy raport = new RaportBiletowy();

        // 1. Zlicza wszystkie bilety w bazie
        raport.setLiczbaBiletow(biletRepository.count());

        // 2. Pobiera Twoją sumę z repozytorium
        BigDecimal suma = biletRepository.zsumujCalkowityPrzychod();

        // 3. Zabezpieczenie: jeśli baza jest pusta, wysyłamy 0 zamiast błędu
        raport.setSumaZarobkow(suma != null ? suma : BigDecimal.ZERO);

        return raport;
    }
}