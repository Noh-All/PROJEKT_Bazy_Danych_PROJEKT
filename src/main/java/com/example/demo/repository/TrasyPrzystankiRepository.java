package com.example.demo.repository;

import com.example.demo.model.TrasyPrzystanki;
import com.example.demo.model.TrasyPrzystankiKlucz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrasyPrzystankiRepository extends JpaRepository<TrasyPrzystanki, TrasyPrzystankiKlucz> {
}