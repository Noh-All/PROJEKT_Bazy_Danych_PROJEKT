package com.example.demo.controller;

import com.example.demo.model.Kurs;
import com.example.demo.repository.KursRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/kursy")
@CrossOrigin(origins = "http://localhost:5173")
public class KursController {

    private final KursRepository kursRepository;

    public KursController(KursRepository kursRepository) {
        this.kursRepository = kursRepository;
    }

    @GetMapping
    public List<Kurs> pobierzWszystkieKursy() {
        return (List<Kurs>) kursRepository.findAll();
    }

    // --- ZAAWANSOWANE WYSZUKIWANIE Z PRZESIADKAMI ---
    @GetMapping("/szukaj")
    public ResponseEntity<?> szukajKursow(@RequestParam String skad, @RequestParam String dokad) {
        java.util.List<java.util.Map<String, Object>> wyniki = new java.util.ArrayList<>();
        Iterable<Kurs> wszystkieKursy = kursRepository.findAll();
        
        int idOpcji = 1;
        
        // 1. BEZPOŚREDNIE
        for (Kurs k : wszystkieKursy) {
            String mPocz = (k.getTrasa() != null && k.getTrasa().getPrzystanekStart() != null) ? k.getTrasa().getPrzystanekStart().getNazwa_miasta() : "";
            String mKonc = (k.getTrasa() != null && k.getTrasa().getPrzystanekKoniec() != null) ? k.getTrasa().getPrzystanekKoniec().getNazwa_miasta() : "";
            
            if (mPocz != null && mPocz.equalsIgnoreCase(skad) && mKonc != null && mKonc.equalsIgnoreCase(dokad)) {
                java.util.Map<String, Object> opcja = new java.util.HashMap<>();
                opcja.put("id_opcji", idOpcji++);
                opcja.put("typ", "BEZPOSREDNI");
                opcja.put("cena_laczna", k.getCena_bazowa());
                
                java.util.List<java.util.Map<String, Object>> listaKursow = new java.util.ArrayList<>();
                listaKursow.add(mapujKursNaFormatReacta(k));
                opcja.put("kursy", listaKursow);
                wyniki.add(opcja);
            }
        }
        
        // 2. PRZESIADKI
        for (Kurs k1 : wszystkieKursy) {
            String mPocz1 = (k1.getTrasa() != null && k1.getTrasa().getPrzystanekStart() != null) ? k1.getTrasa().getPrzystanekStart().getNazwa_miasta() : "";
            String mKonc1 = (k1.getTrasa() != null && k1.getTrasa().getPrzystanekKoniec() != null) ? k1.getTrasa().getPrzystanekKoniec().getNazwa_miasta() : "";
            
            if (mPocz1 != null && mPocz1.equalsIgnoreCase(skad)) {
                for (Kurs k2 : wszystkieKursy) {
                    String mPocz2 = (k2.getTrasa() != null && k2.getTrasa().getPrzystanekStart() != null) ? k2.getTrasa().getPrzystanekStart().getNazwa_miasta() : "";
                    String mKonc2 = (k2.getTrasa() != null && k2.getTrasa().getPrzystanekKoniec() != null) ? k2.getTrasa().getPrzystanekKoniec().getNazwa_miasta() : "";
                    
                    if (mPocz2 != null && mPocz2.equalsIgnoreCase(mKonc1) && mKonc2 != null && mKonc2.equalsIgnoreCase(dokad)) {
                        
                        if (k2.getData_odjazdu() != null && k1.getData_odjazdu() != null && 
                            k2.getData_odjazdu().isAfter(k1.getData_odjazdu())) {
                            
                            java.util.Map<String, Object> opcja = new java.util.HashMap<>();
                            opcja.put("id_opcji", idOpcji++);
                            opcja.put("typ", "PRZESIADKA");
                            
                            double cenaSuma = k1.getCena_bazowa().doubleValue() + k2.getCena_bazowa().doubleValue();
                            opcja.put("cena_laczna", cenaSuma);
                            
                            java.util.List<java.util.Map<String, Object>> listaKursow = new java.util.ArrayList<>();
                            listaKursow.add(mapujKursNaFormatReacta(k1));
                            listaKursow.add(mapujKursNaFormatReacta(k2));
                            opcja.put("kursy", listaKursow);
                            
                            wyniki.add(opcja);
                        }
                    }
                }
            }
        }
        return ResponseEntity.ok(wyniki);
    }

    private java.util.Map<String, Object> mapujKursNaFormatReacta(Kurs k) {
        java.util.Map<String, Object> m = new java.util.HashMap<>();
        m.put("id_kursu", k.getId_kursu());
        m.put("skad", (k.getTrasa() != null && k.getTrasa().getPrzystanekStart() != null) ? k.getTrasa().getPrzystanekStart().getNazwa_miasta() : "");
        m.put("dokad", (k.getTrasa() != null && k.getTrasa().getPrzystanekKoniec() != null) ? k.getTrasa().getPrzystanekKoniec().getNazwa_miasta() : "");
        m.put("data_odjazdu", k.getData_odjazdu());
        m.put("linia", (k.getTrasa() != null) ? k.getTrasa().getNazwa_linii() : "Linia Standardowa");
        return m;
    }
}