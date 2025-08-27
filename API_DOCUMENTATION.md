# TravelAPI - API Documentation

## Опис

TravelAPI надає комплексні послуги для подорожей, включаючи геокодування, пошук аеропортів та пошук авіаквитків через Amadeus API.

## Endpoints

### 1. Геокодування API

API для отримання координат (latitude та longitude) міста з опціональним уточненням країни.

```
GET /api/geocode
```

#### Параметри запиту

| Параметр | Тип | Обов'язковий | Опис |
|----------|-----|--------------|------|
| `city` | string | ✅ | Назва міста |
| `country` | string | ❌ | Назва країни (для уточнення) |

#### Приклади запитів

```bash
# Базовий запит (тільки місто)
GET /api/geocode?city=Київ

# Запит з уточненням країни
GET /api/geocode?city=Львів&country=Україна
```

#### Відповідь

```json
{
  "latitude": 50.4501,
  "longitude": 30.5234,
  "display_name": "Київ, Україна"
}
```

### 2. Пошук аеропортів API

API для пошуку аеропортів поблизу вказаних координат.

```
GET /api/airports
```

#### Параметри запиту

| Параметр | Тип | Обов'язковий | Опис |
|----------|-----|--------------|------|
| `latitude` | number | ✅ | Широта (від -90 до 90) |
| `longitude` | number | ✅ | Довгота (від -180 до 180) |
| `radius` | number | ✅ | Радіус пошуку в кілометрах (1-500) |

#### Приклад запиту

```bash
GET /api/airports?latitude=50.4501&longitude=30.5234&radius=100
```

#### Відповідь

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "type": "location",
        "subType": "airport",
        "name": "Boryspil International Airport",
        "iataCode": "KBP",
        "geoCode": {
          "latitude": 50.345,
          "longitude": 30.8947
        },
        "address": {
          "cityName": "Kiev",
          "countryCode": "UA"
        }
      }
    ],
    "meta": {
      "count": 1
    }
  }
}
```

### 3. Пошук авіаквитків API

API для пошуку авіаквитків через Amadeus Flight Offers Search API.

#### 3.1 Пошук авіаквитків

```
GET /api/flights
POST /api/flights
```

API підтримує два режими пошуку:

**A) Пошук за кодами аеропортів (IATA)**

| Параметр | Тип | Обов'язковий | Опис |
|----------|-----|--------------|------|
| `originLocationCode` | string | ✅ | IATA код аеропорту відправлення |
| `destinationLocationCode` | string | ✅ | IATA код аеропорту призначення |
| `departureDate` | string | ✅ | Дата відправлення (YYYY-MM-DD) |
| `returnDate` | string | ❌ | Дата повернення (YYYY-MM-DD) |
| `adults` | number | ❌ | Кількість дорослих (1-9, за замовчуванням 1) |
| `children` | number | ❌ | Кількість дітей (0-9, за замовчуванням 0) |
| `infants` | number | ❌ | Кількість немовлят (0-9, за замовчуванням 0) |
| `travelClass` | string | ❌ | Клас подорожі (ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST) |
| `includedAirlineCodes` | string[] | ❌ | Коди авіакомпаній для включення |
| `excludedAirlineCodes` | string[] | ❌ | Коди авіакомпаній для виключення |
| `nonStop` | boolean | ❌ | Тільки прямі рейси |
| `currencyCode` | string | ❌ | Код валюти (за замовчуванням USD) |
| `maxPrice` | number | ❌ | Максимальна ціна |
| `max` | number | ❌ | Максимальна кількість результатів (1-250, за замовчуванням 50) |
| `includePrediction` | boolean | ❌ | Включити прогнозування цін |

**B) Пошук за містами (автоматичний пошук найближчих аеропортів)**

| Параметр | Тип | Обов'язковий | Опис |
|----------|-----|--------------|------|
| `originCity` | string | ✅ | Місто відправлення |
| `destinationCity` | string | ✅ | Місто призначення |
| `originCountry` | string | ❌ | Країна відправлення (для уточнення) |
| `destinationCountry` | string | ❌ | Країна призначення (для уточнення) |
| `departureDate` | string | ✅ | Дата відправлення (YYYY-MM-DD) |
| `returnDate` | string | ❌ | Дата повернення (YYYY-MM-DD) |
| `adults` | number | ❌ | Кількість дорослих (1-9, за замовчуванням 1) |
| `children` | number | ❌ | Кількість дітей (0-9, за замовчуванням 0) |
| `infants` | number | ❌ | Кількість немовлят (0-9, за замовчуванням 0) |
| `travelClass` | string | ❌ | Клас подорожі (ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST) |
| `includedAirlineCodes` | string[] | ❌ | Коди авіакомпаній для включення |
| `excludedAirlineCodes` | string[] | ❌ | Коди авіакомпаній для виключення |
| `nonStop` | boolean | ❌ | Тільки прямі рейси |
| `currencyCode` | string | ❌ | Код валюти (за замовчуванням USD) |
| `maxPrice` | number | ❌ | Максимальна ціна |
| `max` | number | ❌ | Максимальна кількість результатів (1-250, за замовчуванням 50) |
| `airportSearchRadius` | number | ❌ | Радіус пошуку аеропортів в км (10-500, за замовчуванням 100) |

#### Приклади запитів

**Пошук за кодами аеропортів:**

```bash
# Базовий пошук (GET)
GET /api/flights?originLocationCode=NYC&destinationLocationCode=LAX&departureDate=2024-06-15&adults=1

# Розширений пошук (POST)
POST /api/flights
Content-Type: application/json

{
  "originLocationCode": "JFK",
  "destinationLocationCode": "SFO",
  "departureDate": "2024-07-01",
  "returnDate": "2024-07-15",
  "adults": 2,
  "children": 1,
  "travelClass": "ECONOMY",
  "currencyCode": "USD",
  "max": 20
}
```

**Пошук за містами:**

```bash
# Базовий пошук за містами (GET)
GET /api/flights?originCity=Київ&destinationCity=Лондон&departureDate=2024-06-15&adults=1

# Розширений пошук за містами (POST)
POST /api/flights
Content-Type: application/json

{
  "originCity": "Київ",
  "destinationCity": "Лондон",
  "originCountry": "Україна",
  "destinationCountry": "Великобританія",
  "departureDate": "2024-07-01",
  "returnDate": "2024-07-15",
  "adults": 2,
  "children": 1,
  "travelClass": "ECONOMY",
  "currencyCode": "USD",
  "max": 20,
  "airportSearchRadius": 150
}
```

#### Відповідь

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "type": "flight-offer",
        "id": "1",
        "source": "GDS",
        "oneWay": false,
        "numberOfBookableSeats": 4,
        "itineraries": [
          {
            "duration": "PT5H30M",
            "segments": [
              {
                "departure": {
                  "iataCode": "JFK",
                  "at": "2024-07-01T10:00:00"
                },
                "arrival": {
                  "iataCode": "SFO",
                  "at": "2024-07-01T13:30:00"
                },
                "carrierCode": "AA",
                "number": "123",
                "duration": "PT5H30M"
              }
            ]
          }
        ],
        "travelerPricings": [
          {
            "travelerId": "1",
            "price": {
              "currency": "USD",
              "total": "299.99",
              "base": "250.00"
            }
          }
        ]
      }
    ],
    "dictionaries": {
      "locations": {
        "JFK": {
          "cityCode": "NYC",
          "countryCode": "US"
        }
      },
      "carriers": {
        "AA": "American Airlines"
      }
    },
    "meta": {
      "count": 1
    }
  }
}
```

#### 3.2 Отримання конкретного авіаквитка

```
GET /api/flights/{id}
```

#### Параметри

| Параметр | Тип | Обов'язковий | Опис |
|----------|-----|--------------|------|
| `id` | string | ✅ | ID авіаквитка |

#### Приклад запиту

```bash
GET /api/flights/1
```

#### Відповідь

```json
{
  "success": true,
  "data": {
    "type": "flight-offer",
    "id": "1",
    "source": "GDS",
    "oneWay": false,
    "numberOfBookableSeats": 4,
    "itineraries": [...],
    "travelerPricings": [...]
  }
}
```

## Коди помилок

### 400 Bad Request
- Відсутні обов'язкові параметри
- Неправильний формат дати
- Недійсні координати
- Перевищення лімітів пасажирів

### 503 Service Unavailable
- Amadeus API не налаштовано
- Відсутні облікові дані

### 500 Internal Server Error
- Внутрішня помилка сервера
- Помилка Amadeus API

## Налаштування

### Amadeus API

Для використання API пошуку авіаквитків необхідно налаштувати облікові дані Amadeus:

1. Зареєструйтесь на [Amadeus for Developers](https://developers.amadeus.com/)
2. Створіть додаток та отримайте API ключі
3. Додайте змінні середовища:

```env
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
```

## Приклади використання

### JavaScript/TypeScript

```typescript
// Пошук авіаквитків
const searchFlights = async (params: FlightSearchParams) => {
  const response = await fetch('/api/flights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error);
  }
  
  return data;
};

// Використання
try {
  const flights = await searchFlights({
    originLocationCode: 'NYC',
    destinationLocationCode: 'LAX',
    departureDate: '2024-06-15',
    adults: 1,
    currencyCode: 'USD'
  });
  
  console.log('Знайдено рейсів:', flights.data.meta.count);
} catch (error) {
  console.error('Помилка:', error.message);
}
```

### cURL

```bash
# Пошук авіаквитків
curl -X POST http://localhost:3000/api/flights \
  -H "Content-Type: application/json" \
  -d '{
    "originLocationCode": "NYC",
    "destinationLocationCode": "LAX",
    "departureDate": "2024-06-15",
    "adults": 1,
    "currencyCode": "USD"
  }'

# Отримання конкретного авіаквитка
curl http://localhost:3000/api/flights/1
```

## Як працює пошук за містами

При використанні пошуку за містами API автоматично виконує наступні кроки:

1. **Геокодування міст** - отримує координати міст через Nominatim (OpenStreetMap)
2. **Пошук аеропортів** - знаходить найближчі аеропорти в радіусі `airportSearchRadius` км
3. **Вибір найкращих аеропортів** - пріоритизує аеропорти за:
   - Кількістю пасажирів (traveler score)
   - Відстанню від міста
   - Валідністю IATA коду
4. **Пошук рейсів** - шукає рейси між найкращими аеропортами
5. **Сортування результатів** - сортує за ціною та обмежує кількість результатів

### Переваги пошуку за містами

- ✅ **Зручність** - не потрібно знати IATA коди аеропортів
- ✅ **Повнота** - автоматично знаходить всі доступні аеропорти
- ✅ **Гнучкість** - можна налаштувати радіус пошуку
- ✅ **Точність** - використовує геокодування для точного визначення місцезнаходження

## Обмеження

- Amadeus API має ліміти на кількість запитів
- Рекомендується кешувати результати
- Точність залежить від даних Amadeus
- Геокодування може займати додатковий час
- Пошук за містами може повертати більше результатів через комбінації аеропортів

## Демонстрація

Відвідайте головну сторінку додатку для інтерактивної демонстрації всіх API функцій.
