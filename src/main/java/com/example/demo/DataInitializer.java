package com.example.demo;

import com.example.demo.model.Bus;
import com.example.demo.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component // To mówi Springowi: "Zajmij się tą klasą"
public class DataInitializer implements CommandLineRunner {

    @Autowired // To "wstrzykuje" repozytorium, żebyś mógł go używać
    private BusRepository busRepository;

    @Override
    public void run(String... args) throws Exception {
        // Sprawdzamy, czy w bazie są już jakieś autobusy
        if (busRepository.count() == 0) {
            System.out.println(">>> Baza jest pusta. Dodaję testowy autobus...");

            Bus bus = new Bus();
            bus.setPlateNumber("KNS 12345");
            bus.setCapacity(50);
            bus.setModel("Mercedes Tourismo");

            busRepository.save(bus); // Zapisujemy do bazy danych PostgreSQL

            System.out.println(">>> Pomyślnie zapisano autobus: " + bus.getPlateNumber());
        } else {
            System.out.println(">>> Autobusy są już w bazie, nie dodaję nowych.");
        }
    }
}