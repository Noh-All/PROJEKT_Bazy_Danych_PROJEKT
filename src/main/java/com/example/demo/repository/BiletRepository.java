package com.example.demo.repository;

import com.example.demo.model.Bilet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface BiletRepository extends JpaRepository<Bilet, Integer> {

    // Nasze zapytanie SQL, które sumuje zarobki
    @Query("SELECT SUM(b.cena_koncowa) FROM Bilet b")
    BigDecimal zsumujCalkowityPrzychod();
}