package com.example.demo.repository;

import com.example.demo.model.Kurs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface KursRepository extends JpaRepository<Kurs, Integer> {
    // Przykład metody, która przyda się do wyszukiwarki połączeń
   // List<Kurs> findByDataOdjazduAfter(LocalDateTime date);
}