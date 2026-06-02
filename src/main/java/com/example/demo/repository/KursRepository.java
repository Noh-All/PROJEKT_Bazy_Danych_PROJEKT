package com.example.demo.repository;

import com.example.demo.model.Kurs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KursRepository extends JpaRepository<Kurs, Integer> {
    
    // Szuka kursów przypisanych do konkretnego kierowcy
    @Query("SELECT k FROM Kurs k WHERE k.kierowca.id_uzytkownika = :idKierowcy ORDER BY k.data_odjazdu ASC")
    List<Kurs> znajdzKursyKierowcy(@Param("idKierowcy") Integer idKierowcy);
}