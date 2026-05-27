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
    public ResponseEntity<?> kupBilet(@RequestBody java.util.Map<String, Object> payload) {
        String login = (String) payload.get("login_uzytkownika");
        java.util.List<?> idKursowRaw = (java.util.List<?>) payload.get("id_kursow");
        
        if (login == null || idKursowRaw == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Brak wymaganych danych w żądaniu JSON\"}");
        }

        com.example.demo.model.Uzytkownik pasazer = null;
        for (com.example.demo.model.Uzytkownik u : uzytkownikRepository.findAll()) {
            if (u.getLogin() != null && u.getLogin().equalsIgnoreCase(login)) {
                pasazer = u;
                break;
            }
        }
        
        if (pasazer == null) {
            return ResponseEntity.status(404).body("{\"error\": \"Nie znaleziono zalogowanego użytkownika w bazie danych!\"}");
        }
        
        java.util.List<Bilet> zapisaneBilety = new java.util.ArrayList<>();
        for (Object obj : idKursowRaw) {
            Integer idKursu = Integer.valueOf(obj.toString()); 
            java.util.Optional<Kurs> oKurs = kursRepository.findById(idKursu);
            
            if (oKurs.isPresent()) {
                Bilet nowyBilet = new Bilet();
                nowyBilet.setPasazer(pasazer); 
                nowyBilet.setKurs(oKurs.get());
                nowyBilet.setStatus_platnosci("Opłacony"); 
                nowyBilet.setCena_koncowa(oKurs.get().getCena_bazowa()); 
                
                // Generujemy unikalne dane wymagane przez Twoją bazę:
                nowyBilet.setNumer_miejsca((int)(Math.random() * 40) + 1); 
                nowyBilet.setKod_qr(UUID.randomUUID().toString()); 
                
                biletRepository.save(nowyBilet);
                zapisaneBilety.add(nowyBilet);
            }
        }
        
        return ResponseEntity.ok("{\"status\": \"sukces\", \"zapisano_biletow\": " + zapisaneBilety.size() + "}");
    }
}