package com.example.demo.controller;

import com.example.demo.model.Uzytkownik;
import com.example.demo.repository.UzytkownikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/uzytkownicy")
@CrossOrigin(origins = "http://localhost:5173")
public class UzytkownikController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @PostMapping("/logowanie")
    public ResponseEntity<?> zaloguj(@RequestBody Map<String, String> dane) {
        String login = dane.get("login");
        String haslo = dane.get("haslo");

        for (Uzytkownik u : uzytkownikRepository.findAll()) {
            if (u.getLogin().equalsIgnoreCase(login) && u.getHaslo().equals(haslo)) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("sukces", true);
                resp.put("rola", u.getRola());
                resp.put("wymaga_zmiany_hasla", u.getCzy_pierwsze_logowanie());
                return ResponseEntity.ok(resp);
            }
        }
        return ResponseEntity.status(401).body("{\"error\": \"Błędne dane\"}");
    }

    @PostMapping("/zmien-haslo")
    public ResponseEntity<?> zmienHaslo(@RequestBody Map<String, String> dane) {
        String login = dane.get("login");
        String noweHaslo = dane.get("nowe_haslo");

        for (Uzytkownik u : uzytkownikRepository.findAll()) {
            if (u.getLogin().equalsIgnoreCase(login)) {
                u.setHaslo(noweHaslo);
                u.setCzy_pierwsze_logowanie(false);
                uzytkownikRepository.save(u);
                return ResponseEntity.ok("{\"status\": \"sukces\"}");
            }
        }
        return ResponseEntity.status(404).body("{\"error\": \"Nie znaleziono użytkownika\"}");
    }

    @PostMapping("/dodaj-pracownika")
    public ResponseEntity<?> dodajPracownika(@RequestBody Map<String, String> dane) {
        Uzytkownik nowy = new Uzytkownik();
        nowy.setLogin(dane.get("login"));
        nowy.setEmail(dane.get("login").toLowerCase() + "@transithub.pl");
        nowy.setHaslo("start123");
        nowy.setRola(dane.get("rola"));
        nowy.setUprawnienia(dane.get("uprawnienia"));
        nowy.setCzy_pierwsze_logowanie(true);
        uzytkownikRepository.save(nowy);
        Map<String, String> resp = new HashMap<>();
        resp.put("status", "sukces");
        resp.put("haslo_startowe", "start123");
        return ResponseEntity.ok(resp);
    }
}