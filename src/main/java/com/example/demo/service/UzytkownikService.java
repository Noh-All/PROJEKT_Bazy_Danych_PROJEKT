package com.example.demo.service;

import com.example.demo.model.Uzytkownik;
import com.example.demo.repository.UzytkownikRepository;
import org.springframework.stereotype.Service;

@Service
public class UzytkownikService {

    private final UzytkownikRepository uzytkownikRepository;

    public UzytkownikService(UzytkownikRepository uzytkownikRepository) {
        this.uzytkownikRepository = uzytkownikRepository;
    }

    // GŁÓWNA LOGIKA ZMIANY HASŁA
    public void zmienHaslo(Integer idUzytkownika, String noweHaslo) {
        // 1. Szukamy użytkownika
        Uzytkownik uzytkownik = uzytkownikRepository.findById(idUzytkownika)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika o ID: " + idUzytkownika));

        // 2. Zmieniamy hasło
        uzytkownik.setHaslo(noweHaslo);

        // 3. Ściągamy flagę pierwszego logowania (używając nazwy z Twojej klasy)
        uzytkownik.setCzy_pierwsze_logowanie(false);

        // 4. Zapisujemy zaktualizowanego użytkownika w bazie
        uzytkownikRepository.save(uzytkownik);
    }
}