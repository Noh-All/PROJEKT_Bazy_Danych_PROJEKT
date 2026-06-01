package com.example.demo.controller;

import com.example.demo.model.Trasa;
import com.example.demo.repository.TrasaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trasy")
@CrossOrigin(origins = "http://localhost:5173") // Przepustka dla Reacta Marcina!
public class TrasaController {

    private final TrasaRepository trasaRepository;

    public TrasaController(TrasaRepository trasaRepository) {
        this.trasaRepository = trasaRepository;
    }

    // 1. POBIERANIE TRAS (Marcin wykorzysta to do wyświetlenia listy w panelu)
    @GetMapping
    public List<Trasa> pobierzWszystkieTrasy() {
        return trasaRepository.findAll();
    }

    // 2. DODAWANIE NOWEJ TRASY (To podepnie Marcin pod formularz dodawania linii)
    @PostMapping("/dodaj")
    public Trasa dodajTrase(@RequestParam String nazwaLinii) {
        Trasa nowaTrasa = new Trasa();
        // Używamy settera z Lomboka na podstawie nazwy Twojego pola
        nowaTrasa.setNazwa_linii(nazwaLinii);

        return trasaRepository.save(nowaTrasa);
    }
}