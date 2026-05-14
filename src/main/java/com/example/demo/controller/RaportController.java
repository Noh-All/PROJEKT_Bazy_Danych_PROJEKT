package com.example.demo.controller;

import com.example.demo.service.BiletService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/raporty")
public class RaportController {

    private final BiletService biletService;

    public RaportController(BiletService biletService) {
        this.biletService = biletService;
    }

    @GetMapping("/rentownosc")
    public String getRaportFinansowy() {
        BigDecimal suma = biletService.getCalkowityPrzychod();
        return "Całkowity przychód z biletów: " + suma + " PLN";
    }
}