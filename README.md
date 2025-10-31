# Länk till vårat [Frontend Repo](https://github.com/kelsaur/meetup-frontend)

# Base URL

```javascript
const API_URL = "https://meetup-backend-latest-pdua.onrender.com";
```

## Auth

**POST** - Registera

```javascript
`${API_URL}/api/auth/register`;
```

**POST** - Logga in

```javascript
`${API_URL}/api/auth/login`;
```

## Meetups

**GET** - Visa alla Meetups

```javascript
`${API_URL}/api/meetups`;
```

**GET** - Sök möte via ord

```javascript
`${API_URL}/api/meetups/search?keyword={text}`;
```

**GET** - Visa ett möte med id

```javascript
`${API_URL}/api/meetups/{meetupId}`;
```

**POST** - Skapa möte (_auth_)

```javascript
`${API_URL}/api/meetups`;
```

**POST** - Anmäla sig till möte (_auth_)

```javascript
`${API_URL}/api/meetups/{meetupId}/register`;
```

**DELETE** - Avanmäla sig från möte (_auth_)

```javascript
`${API_URL}/api/meetups/{meetupId}/unregister`;
```

##

### 📭 _Postman Collection in "./docs"_

##

### Vite

Frontend KAN skapa en `.env`-fil med

```env
VITE_API_URL="https://meetup-backend-latest-pdua.onrender.com"
```

istället för hårdkodad `API_URL`.
