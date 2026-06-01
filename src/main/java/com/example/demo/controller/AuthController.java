package com.example.demo.controller;

import com.example.demo.service.UzytkownikService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Przepustka dla Reacta Marcina
public class AuthController {

    private final UzytkownikService uzytkownikService;

    public AuthController(UzytkownikService uzytkownikService) {
        this.uzytkownikService = uzytkownikService;
    }

    @PostMapping("/zmien-haslo")
    public String zmienHaslo(@RequestParam Integer id, @RequestParam String noweHaslo) {
        // Wywołujemy naszą logikę z serwisu
        uzytkownikService.zmienHaslo(id, noweHaslo);
        return "Hasło zostało pomyślnie zmienione, a flaga zaktualizowana!";
    }
}