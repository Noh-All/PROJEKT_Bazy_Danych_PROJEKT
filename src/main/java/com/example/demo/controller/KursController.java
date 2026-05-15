package com.example.demo.controller;

import com.example.demo.model.Kurs;
import com.example.demo.repository.KursRepository;
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

        return kursRepository.findAll();
    }
}