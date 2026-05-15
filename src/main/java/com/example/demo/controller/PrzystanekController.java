package com.example.demo.controller;

import com.example.demo.model.Przystanek;
import com.example.demo.repository.PrzystanekRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/przystanki")
@CrossOrigin(origins = "http://localhost:5173")
public class PrzystanekController {

    private final PrzystanekRepository przystanekRepository;

    // RĘCZNY KONSTRUKTOR
    public PrzystanekController(PrzystanekRepository przystanekRepository) {
        this.przystanekRepository = przystanekRepository;
    }

    // Pobieranie danych (GET)
    @GetMapping
    public List<Przystanek> pobierzWszystkiePrzystanki() {
        return przystanekRepository.findAll();
    }

    // Dodawanie danych (POST)
    @PostMapping
    public Przystanek dodajPrzystanek(@RequestBody Przystanek przystanek) {
        return przystanekRepository.save(przystanek);
    }
}