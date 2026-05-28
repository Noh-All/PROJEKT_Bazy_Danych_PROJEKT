package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "uzytkownicy")
public class Uzytkownik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_uzytkownika;

    private String login;
    private String email;
    private String haslo;
    private String rola;
    
    // Nowe pola do obsługi pracowników i kierowców
    private Boolean czy_pierwsze_logowanie = true;
    private String uprawnienia;

    // --- Gettery i Settery ---
    
    public Integer getId_uzytkownika() { return id_uzytkownika; }
    public void setId_uzytkownika(Integer id_uzytkownika) { this.id_uzytkownika = id_uzytkownika; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getHaslo() { return haslo; }
    public void setHaslo(String haslo) { this.haslo = haslo; }

    public String getRola() { return rola; }
    public void setRola(String rola) { this.rola = rola; }

    public Boolean getCzy_pierwsze_logowanie() { return czy_pierwsze_logowanie; }
    public void setCzy_pierwsze_logowanie(Boolean czy_pierwsze_logowanie) { this.czy_pierwsze_logowanie = czy_pierwsze_logowanie; }

    public String getUprawnienia() { return uprawnienia; }
    public void setUprawnienia(String uprawnienia) { this.uprawnienia = uprawnienia; }
}