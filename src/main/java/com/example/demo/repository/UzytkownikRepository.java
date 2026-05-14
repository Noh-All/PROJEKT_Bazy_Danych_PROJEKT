package com.example.demo.repository;

import com.example.demo.model.Uzytkownik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UzytkownikRepository extends JpaRepository<Uzytkownik, Integer> {
    // Dodatkowa metoda, która przyda się przy logowaniu
    Optional<Uzytkownik> findByLogin(String login);
}