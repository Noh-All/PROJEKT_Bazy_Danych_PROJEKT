package  com.example.demo.model; // upewnij się, że nazwa paczki się zgadza

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity // To mówi: "Spring, zrób z tego tabelę w bazie"
@Table(name = "buses")
@Getter @Setter // Dzięki temu nie musisz ręcznie pisać getterów i setterów
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String plateNumber; // numer rejestracyjny
    private int capacity;       // liczba miejsc
    private String model;       // marka/model autobusu
}