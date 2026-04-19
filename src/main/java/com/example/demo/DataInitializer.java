package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private BusRepository busRepository;
    @Autowired private DriverRepository driverRepository;
    @Autowired private StopRepository stopRepository;

    @Override
    public void run(String... args) throws Exception {
        if (busRepository.count() == 0) {
            // Dodajemy Autobus
            Bus bus = new Bus();
            bus.setPlateNumber("KNS 12345");
            bus.setModel("Mercedes Tourismo");
            bus.setCapacity(50);
            busRepository.save(bus);

            // Dodajemy Kierowcę
            Driver driver = new Driver();
            driver.setFirstName("Jan");
            driver.setLastName("Kowalski");
            driver.setLicenseNumber("D/998877");
            driver.setStatus("AKTYWNY");
            driverRepository.save(driver);

            // Dodajemy Przystanek
            Stop stop = new Stop();
            stop.setName("Dworzec Główny");
            stop.setCity("Nowy Sącz");
            stopRepository.save(stop);

            System.out.println(">>> Baza została zainicjalizowana testowymi danymi!");
        }
    }
}