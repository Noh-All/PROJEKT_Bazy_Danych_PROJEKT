package com.example.demo.controller;

import com.example.demo.model.Autobus;
import com.example.demo.model.Kurs;
import com.example.demo.model.Trasa;
import com.example.demo.model.Uzytkownik;
import com.example.demo.repository.KursRepository;
import jakarta.persistence.EntityManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/kursy")
@CrossOrigin(origins = "*")
public class KursController {

    private final KursRepository kursRepository;
    private final EntityManager entityManager;

    public KursController(KursRepository kursRepository, EntityManager entityManager) {
        this.kursRepository = kursRepository;
        this.entityManager = entityManager;
    }

    @GetMapping
    public List<Kurs> pobierzWszystkieKursy() {
        return (List<Kurs>) kursRepository.findAll();
    }

    // --- NOWE 1: POBIERANIE TYLKO KIEROWCÓW PO LOGINIE ---
    @GetMapping("/kierowcy")
    public List<Uzytkownik> pobierzKierowcow() {
        return entityManager.createQuery("SELECT u FROM Uzytkownik u WHERE u.rola = 'KIEROWCA'", Uzytkownik.class).getResultList();
    }

    // --- NOWE 2: POBIERANIE AUTOBUSÓW PO REJESTRACJI I MODELU ---
    @GetMapping("/autobusy")
    public List<Autobus> pobierzAutobusy() {
        return entityManager.createQuery("SELECT a FROM Autobus a", Autobus.class).getResultList();
    }

    // --- NOWE 3: SZYBKA ZMIANA CENY ---
    @PostMapping("/zmien-cene")
    public Kurs zmienCeneKursu(@RequestParam Integer idKursu, @RequestParam BigDecimal nowaCena) {
        Kurs kurs = kursRepository.findById(idKursu).orElseThrow(() -> new RuntimeException("Błąd: Nie znaleziono kursu"));
        kurs.setCena_bazowa(nowaCena);
        return kursRepository.save(kurs);
    }

    // --- DODAWANIE KURSU (Bez zmian) ---
    @PostMapping("/dodaj")
    public Kurs dodajKurs(
            @RequestParam Integer idTrasy,
            @RequestParam Integer idKierowcy,
            @RequestParam Integer idAutobusu,
            @RequestParam String dataOdjazdu,
            @RequestParam BigDecimal cena) {

        Kurs nowyKurs = new Kurs();
        nowyKurs.setTrasa(entityManager.getReference(Trasa.class, idTrasy));
        nowyKurs.setKierowca(entityManager.getReference(Uzytkownik.class, idKierowcy));
        nowyKurs.setAutobus(entityManager.getReference(Autobus.class, idAutobusu));
        nowyKurs.setData_odjazdu(LocalDateTime.parse(dataOdjazdu));
        nowyKurs.setCena_bazowa(cena);

        return kursRepository.save(nowyKurs);
    }

    // --- ZAAWANSOWANE WYSZUKIWANIE Z PRZESIADKAMI (Oryginalny kod kolegi) ---
    @GetMapping("/szukaj")
    public ResponseEntity<?> szukajKursow(@RequestParam String skad, @RequestParam String dokad) {
        java.util.List<java.util.Map<String, Object>> wyniki = new java.util.ArrayList<>();
        Iterable<Kurs> wszystkieKursy = kursRepository.findAll();
        
        int idOpcji = 1;
        
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
        
        for (Kurs k1 : wszystkieKursy) {
            String mPocz1 = (k1.getTrasa() != null && k1.getTrasa().getPrzystanekStart() != null) ? k1.getTrasa().getPrzystanekStart().getNazwa_miasta() : "";
            String mKonc1 = (k1.getTrasa() != null && k1.getTrasa().getPrzystanekKoniec() != null) ? k1.getTrasa().getPrzystanekKoniec().getNazwa_miasta() : "";
            
            if (mPocz1 != null && mPocz1.equalsIgnoreCase(skad)) {
                for (Kurs k2 : wszystkieKursy) {
                    String mPocz2 = (k2.getTrasa() != null && k2.getTrasa().getPrzystanekStart() != null) ? k2.getTrasa().getPrzystanekStart().getNazwa_miasta() : "";
                    String mKonc2 = (k2.getTrasa() != null && k2.getTrasa().getPrzystanekKoniec() != null) ? k2.getTrasa().getPrzystanekKoniec().getNazwa_miasta() : "";
                    
                    if (mPocz2 != null && mPocz2.equalsIgnoreCase(mKonc1) && mKonc2 != null && mKonc2.equalsIgnoreCase(dokad)) {
                        
                        if (k2.getData_odjazdu() != null && k1.getData_odjazdu() != null && k2.getData_odjazdu().isAfter(k1.getData_odjazdu())) {
                            java.util.Map<String, Object> opcja = new java.util.HashMap<>();
                            opcja.put("id_opcji", idOpcji++);
                            opcja.put("typ", "PRZESIADKA");
                            opcja.put("cena_laczna", k1.getCena_bazowa().doubleValue() + k2.getCena_bazowa().doubleValue());
                            
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

    // --- FUNKCJE DLA KIEROWCY ---

    // 1. Pobieranie grafiku dla zalogowanego kierowcy
    @GetMapping("/moje/{idKierowcy}")
    public List<Kurs> pobierzMojeKursy(@PathVariable Integer idKierowcy) {
        return kursRepository.znajdzKursyKierowcy(idKierowcy);
    }

    // 2. Zmiana statusu kursu (np. Rozpocznij / Zakończ)
    @PostMapping("/status")
    public Kurs zmienStatusKursu(@RequestParam Integer idKursu, @RequestParam String nowyStatus) {
        Kurs kurs = kursRepository.findById(idKursu).orElseThrow(() -> new RuntimeException("Nie znaleziono kursu"));
        kurs.setStatus_kursu(nowyStatus);
        return kursRepository.save(kurs);
    }
}