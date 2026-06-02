package com.example.demo.controller;

import com.example.demo.model.Przystanek;
import com.example.demo.model.Trasa;
import com.example.demo.model.TrasyPrzystanki;
import com.example.demo.model.TrasyPrzystankiKlucz;
import com.example.demo.repository.PrzystanekRepository;
import com.example.demo.repository.TrasaRepository;
import com.example.demo.repository.TrasyPrzystankiRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trasy")
@CrossOrigin(origins = "*")
public class TrasaController {

    private final TrasaRepository trasaRepository;
    private final PrzystanekRepository przystanekRepository;
    private final TrasyPrzystankiRepository trasyPrzystankiRepository;

    public TrasaController(TrasaRepository trasaRepository, 
                           PrzystanekRepository przystanekRepository,
                           TrasyPrzystankiRepository trasyPrzystankiRepository) {
        this.trasaRepository = trasaRepository;
        this.przystanekRepository = przystanekRepository;
        this.trasyPrzystankiRepository = trasyPrzystankiRepository;
    }

    @GetMapping
    public List<Trasa> pobierzWszystkieTrasy() {
        return trasaRepository.findAll();
    }

    // ZMIANA: Przyjmujemy dowolną listę numerów ID przystanków!
    @PostMapping("/dodaj")
    public Trasa dodajTraseWieloPrzystankowa(
            @RequestParam String nazwaLinii,
            @RequestParam List<Integer> przystankiIds) {
        
        Trasa nowaTrasa = new Trasa();
        nowaTrasa.setNazwa_linii(nazwaLinii);

        // Ustawiamy Start i Koniec na podstawie pierwszego i ostatniego elementu z listy
        if (!przystankiIds.isEmpty()) {
            nowaTrasa.setPrzystanekStart(przystanekRepository.findById(przystankiIds.get(0)).orElse(null));
            nowaTrasa.setPrzystanekKoniec(przystanekRepository.findById(przystankiIds.get(przystankiIds.size() - 1)).orElse(null));
        }

        // 1. Zapisujemy główną trasę w bazie
        Trasa zapisanaTrasa = trasaRepository.save(nowaTrasa);

        // 2. Tworzymy szczegółową rozpiskę (1 przystanek, 2 przystanek, 3...)
        int kolejnosc = 1;
        for (Integer idPrzystanku : przystankiIds) {
            Przystanek p = przystanekRepository.findById(idPrzystanku).orElse(null);
            if (p != null) {
                TrasyPrzystanki tp = new TrasyPrzystanki();
                tp.setId(new TrasyPrzystankiKlucz(zapisanaTrasa.getId_trasy(), p.getId_przystanku()));
                tp.setTrasa(zapisanaTrasa);
                tp.setPrzystanek(p);
                tp.setKolejnosc(kolejnosc++);
                
                trasyPrzystankiRepository.save(tp); // Zapis do tabeli łączącej
            }
        }

        return zapisanaTrasa;
    }

    @DeleteMapping("/usun/{id}")
    public void usunTrase(@PathVariable Integer id) {
        trasaRepository.deleteById(id);
    }
}