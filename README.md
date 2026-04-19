Proponowane języki dla projektu :

1. Java + Spring Boot + PostgreSQL.       // jeśli chcemy zrobić to "profesjonalnie"

1. Model ERD (Entity Relationship Diagram)
~NAJWAŻNIEJSZY~. Musimy wstawić schemat graficzny pokazujący, jak tabele łączą się ze sobą.

Co opisać: Relacje (jeden-do-wielu, wiele-do-wielu), klucze główne (PK) i klucze obce (FK).

Przykład: Relacja między Trasa a Przystanek (czy trasa to lista przystanków? Jak zachować ich kolejność?).

2. Słownik Danych (Data Dictionary)
Tabela opisująca każdą kolumnę w każdej tabeli.

Kolumny: Nazwa pola, Typ danych (np. VARCHAR(50), TIMESTAMP, INTEGER), Czy może być nullem (NULL/NOT NULL), Krótki opis.

 Przy PostgreSQL warto wspomnieć o typach specjalistycznych, np. DECIMAL dla cen biletów . // nie używamy float to pieniędzy!!!

3. Logika Więzów Spójności (Constraints)
 "Integralność danych", musimy pokazać, jak to zrobiliśmy w SQL.

CHECK constraints: Np. cena > 0 albo liczba_miejsc >= 0.

UNIQUE: Np. numer rejestracyjny autobusu musi być unikalny.

4. Przypadki Użycia Bazy Danych (SQL Queries)
Pokaż kilka "mięsistych" zapytań SQL, które Twoja aplikacja będzie wykonywać. Nie wpisuj prostych SELECT *, ale coś trudniejszego:

Raport: "Zestawienie dochodów z biletów dla konkretnej trasy w ostatnim miesiącu".

Logika: "Wyszukanie wolnych miejsc w autobusie na trasie X w dniu Y" (to wymaga złączenia kilku tabel: Trips, Buses i Tickets).

5. Architektura Systemu
Krótki schemat pokazujący, że używamy:

Backend: Java + Spring Boot.

Warstwa dostępu do danych: Spring Data JPA / Hibernate (warto wspomnieć, że to on mapuje klasy Javy na tabele w Postgresie).

Baza: PostgreSQL.

6. Bezpieczeństwo i Role (RBAC)
Opis, kto co może robić na poziomie bazy/aplikacji:

Klient: Widzi tylko rozkłady i swoje bilety.

Kierowca: Widzi swój grafik, ale nie może edytować cen biletów.

Admin: Ma pełny dostęp do wszystkiego (CRUD na każdej tabeli).
