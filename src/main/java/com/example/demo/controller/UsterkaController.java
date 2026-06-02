package com.example.demo.controller;

import com.example.demo.model.Usterka;
import com.example.demo.repository.UsterkaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usterki")
@CrossOrigin(origins = "*") // Przepustka dla Marcina!
public class UsterkaController {

    private final UsterkaRepository usterkaRepository;

    public UsterkaController(UsterkaRepository usterkaRepository) {
        this.usterkaRepository = usterkaRepository;
    }

    // 1. DLA KIEROWCY: Zgłaszanie nowej usterki
    @PostMapping("/zglos")
    public Usterka zglosUsterke(@RequestParam Integer idAutobusu, @RequestParam String opis) {
        Usterka nowaUsterka = new Usterka();
        nowaUsterka.setId_autobusu(idAutobusu);
        nowaUsterka.setOpis(opis);
        nowaUsterka.setCzy_naprawiona(false); // Świeża sprawa

        return usterkaRepository.save(nowaUsterka);
    }

    // 2. DLA ADMINA: Pobieranie listy wszystkich usterek
    @GetMapping
    public List<Usterka> pobierzUsterki() {
        return usterkaRepository.findAll();
    }

    // 3. DLA ADMINA: Zaznaczanie usterki jako naprawionej
    @PostMapping("/napraw")
    public String naprawUsterke(@RequestParam Integer idUsterki) {
        Usterka usterka = usterkaRepository.findById(idUsterki)
                .orElseThrow(() -> new RuntimeException("Błąd: Nie znaleziono usterki o takim ID!"));

        usterka.setCzy_naprawiona(true);
        usterkaRepository.save(usterka);

        return "SUKCES: Usterka nr " + idUsterki + " została oznaczona jako naprawiona!";
    }
}