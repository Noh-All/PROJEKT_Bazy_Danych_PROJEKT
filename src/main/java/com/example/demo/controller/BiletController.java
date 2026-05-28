package com.example.demo.controller;

import com.example.demo.model.Bilet;
import com.example.demo.model.Kurs;
import com.example.demo.repository.BiletRepository;
import com.example.demo.repository.KursRepository;
import com.example.demo.repository.UzytkownikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/bilety")
@CrossOrigin(origins = "http://localhost:5173")
public class BiletController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private KursRepository kursRepository;

    @Autowired
    private BiletRepository biletRepository;

    @PostMapping("/kup")
    public ResponseEntity<?> kupBilet(@RequestBody Map<String, Object> payload) {
        String login = (String) payload.get("login_uzytkownika");
        List<?> idKursowRaw = (List<?>) payload.get("id_kursow");
        
        if (login == null || idKursowRaw == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Brak danych\"}");
        }

        com.example.demo.model.Uzytkownik pasazer = null;
        for (com.example.demo.model.Uzytkownik u : uzytkownikRepository.findAll()) {
            if (u.getLogin() != null && u.getLogin().equalsIgnoreCase(login)) {
                pasazer = u;
                break;
            }
        }
        
        if (pasazer == null) {
            return ResponseEntity.status(404).body("{\"error\": \"Nie znaleziono usera\"}");
        }
        
        List<String> wygenerowaneKody = new ArrayList<>();
        
        for (Object obj : idKursowRaw) {
            Integer idKursu = Integer.valueOf(obj.toString()); 
            java.util.Optional<Kurs> oKurs = kursRepository.findById(idKursu);
            
            if (oKurs.isPresent()) {
                Bilet nowyBilet = new Bilet();
                nowyBilet.setPasazer(pasazer); 
                nowyBilet.setKurs(oKurs.get());
                nowyBilet.setStatus_platnosci("Opłacony"); 
                nowyBilet.setCena_koncowa(oKurs.get().getCena_bazowa()); 
                nowyBilet.setNumer_miejsca((int)(Math.random() * 40) + 1); 
                
                // --- TO JEST KLUCZ: GENEROWANIE KODU QR ---
                String qrKod = UUID.randomUUID().toString();
                nowyBilet.setKod_qr(qrKod); 
                
                biletRepository.save(nowyBilet);
                wygenerowaneKody.add(qrKod);
            }
        }
        
        // Zwracamy kody do Reacta!
        Map<String, Object> odpowiedz = new HashMap<>();
        odpowiedz.put("status", "sukces");
        odpowiedz.put("kody_qr", wygenerowaneKody);
        return ResponseEntity.ok(odpowiedz);
    }

    @PostMapping("/skanuj")
    public ResponseEntity<?> skanujBilet(@RequestBody Map<String, String> payload) {
        String kodQr = payload.get("kod_qr");

        for (Bilet b : biletRepository.findAll()) {
            if (kodQr.equals(b.getKod_qr())) {
                if ("Wykorzystany".equalsIgnoreCase(b.getStatus_platnosci())) {
                    return ResponseEntity.badRequest().body("{\"error\": \"Ten bilet został już skasowany!\"}");
                }
                b.setStatus_platnosci("Wykorzystany");
                biletRepository.save(b);
                return ResponseEntity.ok("{\"message\": \"Bilet ważny! Zmieniono status na Wykorzystany.\"}");
            }
        }
        return ResponseEntity.status(404).body("{\"error\": \"Błąd weryfikacji! Brak w bazie.\"}");
    }
}