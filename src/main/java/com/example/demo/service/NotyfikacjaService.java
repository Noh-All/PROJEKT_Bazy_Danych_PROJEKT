package com.example.demo.service;

import com.example.demo.model.Bilet;
import org.springframework.stereotype.Service;

@Service
public class NotyfikacjaService {

    public void wyslijPotwierdzenieZakupu(Bilet bilet) {
        // Symulacja wysyłki e-maila - w logach zobaczymy profesjonalny raport
        System.out.println("------------------------------------------------");
        System.out.println("📧 SYSTEM POWIADOMIEŃ: Wysyłanie e-maila...");
        System.out.println("DO: " + bilet.getPasazer().getEmail());
        System.out.println("TEMAT: Potwierdzenie zakupu biletu nr " + bilet.getId_biletu());
        System.out.println("TREŚĆ: Dziękujemy za skorzystanie z TransitHub!");
        System.out.println("Twój kod QR to: " + bilet.getKod_qr());
        System.out.println("Cena: " + bilet.getCena_koncowa() + " PLN");
        System.out.println("------------------------------------------------");
    }
}