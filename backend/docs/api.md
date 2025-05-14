# 📘 API Документация — Stage 1

---

## 🔐 Авторизация

### POST /auth/login
Аутентификация пользователя и получение токена.

#### Request:
```json
{
  "email": "ivan@example.com",
  "password": "12345678"
}
```

#### Response:
```json
{
  "access_token": "..."
}
```

---

## 👤 Пользователи

### GET /user
Только для админов. Получение списка всех пользователей.

#### Headers:
- Authorization: Bearer `token`

#### Response:
```json
[
  {
    "id": 1,
    "email": "yulia@example.com",
    "name": "Юля",
    "role": "manager"
  },
  {
    "id": 2,
    "email": "ivan@example.com",
    "name": "Иван",
    "role": "admin"
  }
]