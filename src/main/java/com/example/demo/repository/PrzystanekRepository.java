package com.example.demo.repository;

import com.example.demo.model.Przystanek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrzystanekRepository extends JpaRepository<Przystanek, Integer> {
}