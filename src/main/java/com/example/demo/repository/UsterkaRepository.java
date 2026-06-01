package com.example.demo.repository;

import com.example.demo.model.Usterka;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsterkaRepository extends JpaRepository<Usterka, Integer> {
}