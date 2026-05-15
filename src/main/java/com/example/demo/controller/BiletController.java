package com.example.demo.controller;

import com.example.demo.model.Bilet;
import com.example.demo.service.BiletService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bilety")
@CrossOrigin(origins = "http://localhost:5173")
public class BiletController {

    private final BiletService biletService;

    // Ręczny konstruktor łączący nasz kontroler z serwisem
    public BiletController(BiletService biletService) {
        this.biletService = biletService;
    }

    // Endpoint do kupowania biletu
    @PostMapping("/kup")
    public Bilet kupBilet(@RequestParam Integer idKursu, @RequestParam Integer idPasazera) {
        // Kontroler tylko przyjmuje żądanie i przekazuje je do "mózgu", czyli Twojego Serwisu
        return biletService.kupBilet(idKursu, idPasazera);
    }
}