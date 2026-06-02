package com.example.demo.controller;

import com.example.demo.model.Autobus;
import com.example.demo.repository.AutobusRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/autobusy")
@CrossOrigin(origins = "*")
public class AutobusController {

    private final AutobusRepository autobusRepository;

    public AutobusController(AutobusRepository autobusRepository) { 
        this.autobusRepository = autobusRepository; 
    }
    
    @GetMapping
    public List<Autobus> pobierzWszystkie() { 
        return autobusRepository.findAll(); 
    }
    
    @PostMapping("/dodaj")
    public Autobus dodaj(@RequestBody Autobus a) { 
        return autobusRepository.save(a); 
    }
    
    @DeleteMapping("/usun/{id}")
    public void usun(@PathVariable Integer id) { 
        autobusRepository.deleteById(id); 
    }
}