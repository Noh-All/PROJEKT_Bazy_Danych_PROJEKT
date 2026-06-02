package com.example.demo.repository;

import com.example.demo.model.Bilet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface BiletRepository extends JpaRepository<Bilet, Integer> {

    // Nasze zapytanie SQL, które sumuje globalne zarobki
    @Query("SELECT SUM(b.cena_koncowa) FROM Bilet b")
    BigDecimal zsumujCalkowityPrzychod();

    // NOWE ZAPYTANIE: Grupuje przychody i liczbę biletów po konkretnych trasach
    @Query("SELECT new map(b.kurs.trasa.id_trasy as idTrasy, COUNT(b) as liczbaBiletow, SUM(b.cena_koncowa) as przychod) FROM Bilet b GROUP BY b.kurs.trasa.id_trasy")
    List<Map<String, Object>> raportDlaPojedynczychTras();
}