package com.example.demo.controller;

import com.example.demo.model.Uzytkownik;
import com.example.demo.repository.UzytkownikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/uzytkownicy")
@CrossOrigin(origins = "http://localhost:5173")
public class UzytkownikController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    // --- REJESTRACJA ---
    @PostMapping("/rejestracja")
    public ResponseEntity<?> zarejestrujUzytkownika(@RequestBody Uzytkownik nowyUzytkownik) {
        // Każdy nowy użytkownik z automatu dostaje rolę PASAZER
        nowyUzytkownik.setRola("PASAZER");
        Uzytkownik zapisany = uzytkownikRepository.save(nowyUzytkownik);
        return ResponseEntity.ok(zapisany);
    }

   // --- LOGOWANIE ---
    @PostMapping("/logowanie")
    public ResponseEntity<String> zaloguj(@RequestBody Uzytkownik daneLogowania) {
        // 1. Pobieramy wszystkich użytkowników z bazy danych
        Iterable<Uzytkownik> wszyscyUzytkownicy = uzytkownikRepository.findAll();

        // 2. Szukamy czy jest tam ktoś z takim samym loginem i hasłem
        for (Uzytkownik u : wszyscyUzytkownicy) {
            if (u.getLogin() != null && u.getLogin().equals(daneLogowania.getLogin()) &&
                u.getHaslo() != null && u.getHaslo().equals(daneLogowania.getHaslo())) {
                
                // Znaleziono! Wpuszczamy.
                return ResponseEntity.ok("{\"status\": \"zalogowano\"}");
            }
        }

        // 3. Jeśli pętla się skończy i nikogo nie znajdzie - odrzucamy! (Błąd 401)
        return ResponseEntity.status(401).body("{\"status\": \"błąd logowania\"}");
    }
}