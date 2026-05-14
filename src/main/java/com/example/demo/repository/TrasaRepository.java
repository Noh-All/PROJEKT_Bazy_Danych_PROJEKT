package com.example.demo.repository;

import com.example.demo.model.Trasa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrasaRepository extends JpaRepository<Trasa, Integer> {
}