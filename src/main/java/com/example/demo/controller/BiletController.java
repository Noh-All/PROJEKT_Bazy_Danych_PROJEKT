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
@CrossOrigin(origins = "*")
public class BiletController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private KursRepository kursRepository;

    @Autowired
    private BiletRepository biletRepository;

    @GetMapping("/moje")
    public ResponseEntity<?> pobierzMojeBilety(@RequestParam String login) {
        com.example.demo.model.Uzytkownik pasazer = null;
        for (com.example.demo.model.Uzytkownik u : uzytkownikRepository.findAll()) {
            if (u.getLogin() != null && u.getLogin().equalsIgnoreCase(login)) {
                pasazer = u;
                break;
            }
        }
        
        if (pasazer == null) {
            return ResponseEntity.ok(new ArrayList<>()); 
        }

        List<Map<String, Object>> historiaBiletow = new ArrayList<>();
        
        for (Bilet b : biletRepository.findAll()) {
            if (b.getPasazer().getId_uzytkownika().equals(pasazer.getId_uzytkownika()) 
                && !"Wykorzystany".equalsIgnoreCase(b.getStatus_platnosci())) {
                
                Map<String, Object> biletMap = new HashMap<>();
                
                Map<String, Object> kursMap = new HashMap<>();
                kursMap.put("id_kursu", b.getKurs().getId_kursu());
                kursMap.put("skad", b.getKurs().getTrasa().getPrzystanekStart().getNazwa_miasta());
                kursMap.put("dokad", b.getKurs().getTrasa().getPrzystanekKoniec().getNazwa_miasta());
                
                List<Map<String, Object>> listaKursow = new ArrayList<>();
                listaKursow.add(kursMap);
                
                biletMap.put("kursy", listaKursow);
                
                List<String> kody = new ArrayList<>();
                kody.add(b.getKod_qr());
                biletMap.put("kody_qr", kody);
                
                historiaBiletow.add(biletMap);
            }
        }
        return ResponseEntity.ok(historiaBiletow);
    }

    @PostMapping("/kup")
    public ResponseEntity<?> kupBilet(@RequestBody Map<String, Object> payload) {
        String login = (String) payload.get("login_uzytkownika");
        List<?> idKursowRaw = (List<?>) payload.get("id_kursow");
        
        if (login == null || idKursowRaw == null) return ResponseEntity.badRequest().body("{\"error\": \"Brak danych\"}");

        com.example.demo.model.Uzytkownik pasazer = null;
        for (com.example.demo.model.Uzytkownik u : uzytkownikRepository.findAll()) {
            if (u.getLogin() != null && u.getLogin().equalsIgnoreCase(login)) {
                pasazer = u; break;
            }
        }
        if (pasazer == null) return ResponseEntity.status(404).body("{\"error\": \"Nie znaleziono usera\"}");
        
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
                
                String qrKod = UUID.randomUUID().toString();
                nowyBilet.setKod_qr(qrKod); 
                
                biletRepository.save(nowyBilet);
                wygenerowaneKody.add(qrKod);
            }
        }
        
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

    // --- NOWA FUNKCJA: ZWROT BILETU ---
    @DeleteMapping("/anuluj/{kodQr}")
    public ResponseEntity<?> anulujBilet(@PathVariable String kodQr) {
        for (Bilet b : biletRepository.findAll()) {
            if (kodQr.equals(b.getKod_qr())) {
                if ("Wykorzystany".equalsIgnoreCase(b.getStatus_platnosci())) {
                    return ResponseEntity.badRequest().body("{\"error\": \"Błąd! Nie można zwrócić biletu, który został już skasowany przez kierowcę.\"}");
                }
                
                java.math.BigDecimal kwota = b.getCena_koncowa();
                biletRepository.delete(b);
                return ResponseEntity.ok("{\"message\": \"Bilet został pomyślnie anulowany. Zwrot środków w kwocie " + kwota + " PLN wpłynie na Twoje konto do 3 dni roboczych.\"}");
            }
        }
        return ResponseEntity.status(404).body("{\"error\": \"Nie znaleziono takiego biletu w systemie.\"}");
    }
}