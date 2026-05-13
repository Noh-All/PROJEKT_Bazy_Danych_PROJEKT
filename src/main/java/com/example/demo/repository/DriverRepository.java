package com.example.demo.repository;

import com.example.demo.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    // Spring automatycznie doda tutaj metody typu save(), findAll(), delete() itd.
}