# Specyfikacja Projektu: GameSense
Autor: Zespol GameSense  
Typ projektu: Platforma analityczno-spolecznosciowa / SaaS (web)

## 1. Specyfikacja techniczna

Projekt `GameSense` to aplikacja webowa full-stack oparta o architekture monorepo oraz podejscie API-first. Celem systemu jest analiza gustu graczy i budowa warstwy spolecznosciowej wokol bibliotek gier.

Kluczowy stos technologiczny:
- Frontend: React (Vite), TypeScript, Tailwind CSS, TanStack Query, Recharts
- Backend: Node.js, Express.js, TypeScript
- Baza danych: PostgreSQL + Prisma ORM
- Integracje zewnetrzne: IGDB API (metadane gier), Steam Web API / Steam OpenID (autoryzacja i biblioteka gracza)
- Architektura repo: monorepo (`client`, `server`, `packages/types`, `packages/config`)

Architektura informacji:
- Podzial backendu na warstwy: `routes -> controllers -> services -> integrations/repositories`
- Wspoldzielone typy kontraktow API w pakiecie `@gamesense/types`
- Kontrakty endpointow zorientowane na MVP i dalsza rozbudowe pod analityke

## 2. Specyfikacja funkcjonalna

### 2.1 Modul autoryzacji i importu biblioteki (Steam)
System umozliwia logowanie uzytkownika przez Steam (OpenID), a nastepnie mapowanie konta do lokalnego profilu i wydanie tokenu JWT. Po autoryzacji backend importuje i synchronizuje biblioteke gracza.

### 2.2 Modul katalogu i wyszukiwarki gier
Aplikacja udostepnia endpointy wyszukiwawcze oparte o IGDB API. Uzytkownik moze pobierac podstawowe metadane gry: nazwa, gatunki, okladka i rok wydania.

### 2.3 Modul Taste Overlap
System wylicza zgodnosc gustu miedzy dwoma graczami za pomoca indeksu Jaccarda na zbiorach gatunkow/tagow. Wynik zwraca:
- overlap index (0-1),
- czesc wspolna,
- elementy unikalne dla kazdego gracza.

### 2.4 Modul Gaming Wrapped
Panel podsumowan okresowych prezentujacy statystyki grania w formie infografik (czas gry, struktura gatunkow, aktywnosc). Warstwa wizualna oparta o Recharts.

## 3. Przypadki uzycia (MVP)

Aktorzy:
- Uzytkownik niezalogowany
- Uzytkownik zalogowany
- System integracyjny (Steam / IGDB)

### Przypadek 1: Logowanie i aktywacja sesji
Scenariusz: Uzytkownik uruchamia logowanie przez Steam, backend waliduje callback i zwraca token JWT.
Kryteria akceptacji:
- zwrot `200` i poprawny `accessToken`,
- utworzenie/aktualizacja profilu uzytkownika,
- mozliwosc autoryzacji kolejnych endpointow przez naglowek `Bearer`.

### Przypadek 2: Pobranie profilu gracza
Scenariusz: Uzytkownik z aktywna sesja pobiera profil i statystyki biblioteki.
Kryteria akceptacji:
- bez tokenu endpoint zwraca `401`,
- z poprawnym tokenem endpoint zwraca `200` i profil z agregatami.

### Przypadek 3: Wyliczenie kompatybilnosci
Scenariusz: Uzytkownik porownuje dwa profile graczy.
Kryteria akceptacji:
- dla dwoch roznych graczy zwracany jest wynik Jaccarda i breakdown zbiorow,
- dla porownania tego samego gracza endpoint zwraca `400`.

## 4. Architektura systemu

| Komponent | Opis i rola |
|---|---|
| Frontend (`client`) | Interfejs React z panelem testowym i modulami funkcjonalnymi. Komunikacja z API przez typed client. |
| Backend API (`server`) | Express API odpowiedzialne za autoryzacje, profil, wyszukiwanie gier i kompatybilnosc. |
| Integracja Steam | Wejscie OpenID i pobieranie danych biblioteki gracza. |
| Integracja IGDB | Zrodlo metadanych gier wykorzystywane przez katalog i wyszukiwarke. |
| Database (PostgreSQL) | Trwale przechowywanie danych domenowych: uzytkownicy, gry, gatunki, relacje biblioteczne. |
| Prisma ORM | Mapowanie modeli relacyjnych i migracje bazy. |
| Wspolne kontrakty (`packages/types`) | Definicje DTO oraz typow odpowiedzi API dla client/server. |

Model danych (MVP):
- `User`
- `Game`
- `Genre`
- `UserGame` (relacja user-gra + metryki czasu/rating)
- `GameGenre` (relacja wiele-do-wielu gra-gatunek)

## 5. Specyfikacja niefunkcjonalna

- Wydajnosc API: podstawowe endpointy MVP powinny odpowiadac w czasie ponizej 500 ms (bez opoznien zewnetrznych API).
- Skalowalnosc: warstwa serwisowa przygotowana pod cache i kolejkowanie synchronizacji importu.
- Bezpieczenstwo: token JWT, walidacja wejscia (Zod), separacja danych dostepowych przez zmienne srodowiskowe.
- Niezawodnosc: testy smoke dla kluczowych endpointow (`health`, `auth`, `games`, `profile`, `compatibility`).
- Obserwowalnosc: mozliwosc rozszerzenia o request id i strukturalne logowanie.
- Dostepnosc: aplikacja webowa zgodna z nowoczesnymi przegladarkami desktop/mobile.

## 6. Harmonogram i wycena projektu

Szacunkowy czas realizacji przez zespol 1-2 osobowy: **420-560 godzin**.

| Etap prac | Zakres zadan | Szacowany czas | Szacowany koszt (PLN netto) |
|---|---|---:|---:|
| Analiza i architektura | Doprecyzowanie domeny, kontrakty API, model danych, plan sprintow | 40-60 h | 4 000 - 6 000 |
| Foundation / Setup | Monorepo, CI, Prisma, szkielet backendu i frontendu | 70-90 h | 7 000 - 9 000 |
| Integracje i backend core | Steam auth/import, IGDB proxy, profile, compatibility | 150-200 h | 15 000 - 20 000 |
| Frontend i analityka | Widoki, query state, wizualizacje, UX prototypowe | 100-130 h | 10 000 - 13 000 |
| Testy, hardening, wdrozenie | Testy integracyjne, optymalizacje, przygotowanie demo/prod | 60-80 h | 6 000 - 8 000 |

Warunki widelek:
- Finalny koszt zalezy od zakresu integracji Steam/IGDB, poziomu hardeningu oraz docelowej jakosci UX.
- Koszty uslug zewnetrznych (hosting, observability, plan API, narzedzia SaaS) nie sa ujete w roboczogodzinach.

## 7. Kryteria odbioru prototypu v0.1

- Dziala logowanie/callback autoryzacji i pozyskanie tokenu sesji.
- Dziala wyszukiwarka gier po frazie (`/api/games/search`).
- Dziala profil gracza wymagajacy autoryzacji.
- Dziala endpoint kompatybilnosci dwoch graczy z walidacja scenariuszy blednych.
- Frontend udostepnia interaktywny panel do testowania przeplywow bez narzedzi zewnetrznych.
- `npm run test`, `npm run typecheck`, `npm run build` przechodza poprawnie.
