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
    public ResponseEntity<String> zaloguj() {
        // Skoro Wasz system zabezpieczeń (Basic Auth) i tak sprawdza hasło przy wejściu,
        // to jeśli kod dotrze do tego miejsca, oznacza to, że dane są poprawne!
        return ResponseEntity.ok("{\"status\": \"zalogowano\"}");
    }
}