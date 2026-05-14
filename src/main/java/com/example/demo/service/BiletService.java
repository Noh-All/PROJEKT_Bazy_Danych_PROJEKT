package com.example.demo.service;

import com.example.demo.model.Bilet;
import com.example.demo.model.Kurs;
import com.example.demo.model.Uzytkownik;
import com.example.demo.repository.BiletRepository;
import com.example.demo.repository.KursRepository;
import com.example.demo.repository.UzytkownikRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class BiletService {

    private final BiletRepository biletRepository;
    private final KursRepository kursRepository;
    private final UzytkownikRepository uzytkownikRepository;
    private final NotyfikacjaService notyfikacjaService;

    public BiletService(BiletRepository biletRepository,
                        KursRepository kursRepository,
                        UzytkownikRepository uzytkownikRepository,
                        NotyfikacjaService notyfikacjaService) {
        this.biletRepository = biletRepository;
        this.kursRepository = kursRepository;
        this.uzytkownikRepository = uzytkownikRepository;
        this.notyfikacjaService = notyfikacjaService;
    }

    public String generujUnikalnyKodQR() {
        return "QR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public Bilet kupBilet(Integer idKursu, Integer idPasazera) {
        // 1. Szukamy danych w bazie
        Kurs kurs = kursRepository.findById(idKursu)
                .orElseThrow(() -> new RuntimeException("Błąd: Nie znaleziono takiego kursu w bazie!"));

        Uzytkownik pasazer = uzytkownikRepository.findById(idPasazera)
                .orElseThrow(() -> new RuntimeException("Błąd: Nie znaleziono takiego pasażera!"));

        // 2. Tworzymy obiekt biletu
        Bilet nowyBilet = new Bilet();
        nowyBilet.setKurs(kurs);
        nowyBilet.setPasazer(pasazer);
        nowyBilet.setNumer_miejsca(new java.util.Random().nextInt(50) + 1);
        nowyBilet.setCena_koncowa(kurs.getCena_bazowa());
        nowyBilet.setStatus_platnosci("Opłacony");
        nowyBilet.setKod_qr(generujUnikalnyKodQR());

        // 3. Zapisujemy do bazy
        Bilet zapisanyBilet = biletRepository.save(nowyBilet);

        // 4. INTEGRACJA: Wysyłamy powiadomienie
        notyfikacjaService.wyslijPotwierdzenieZakupu(zapisanyBilet);

        return zapisanyBilet;
    }

    public BigDecimal getCalkowityPrzychod() {
        BigDecimal suma = biletRepository.zsumujCalkowityPrzychod();
        return suma != null ? suma : BigDecimal.ZERO;
    }
}