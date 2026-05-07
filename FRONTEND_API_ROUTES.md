# Tripzy API Frontend Handoff

Base URL in development is usually `http://localhost:<PORT>`.

## Seeded Login Accounts

All seeded users use password `Abc@123`.

| Role | Email | Notes |
| --- | --- | --- |
| Super admin | `super@demo.com` | Can use admin guarded APIs |
| Admin | `admin@demo.com` | Can use admin guarded APIs |
| User | `user@demo.com` | Normal customer/test booking user |
| Hotel owner | `owner@demo.com` | Has access to provider hotel APIs |
| Hotel staff | `staff@demo.com` | Has access to `Demo Hotel` |

The seed also creates 5 demo hotel brands across Goa, Bengaluru, Udaipur, Manali, and Kolkata. Each brand has 2 properties, 3 room types per property, property images, room images, policies, documents, amenities, reviews, sample bookings, and payments.

## Auth APIs

### `POST /api/auth/register`

Body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Abc@123",
  "phone_number": "+919999999999"
}
```

Returns user data, `access_token`, and `refresh_token`. Also sends email OTP.

### `POST /api/auth/login`

Body:

```json
{
  "email": "owner@demo.com",
  "password": "Abc@123"
}
```

Returns:

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "Hotel Owner",
      "email": "owner@demo.com",
      "platformRole": "user",
      "email_verified": true
    },
    "hotelAccess": [
      {
        "hotelId": "uuid",
        "hotelName": "Demo Hotel",
        "role": "hotel_owner"
      }
    ],
    "access_token": "jwt",
    "refresh_token": "jwt"
  }
}
```

Use `Authorization: Bearer <access_token>` for protected/admin/provider endpoints.

### `POST /api/auth/refresh`

Body:

```json
{
  "refresh_token": "jwt"
}
```

Returns new `access_token` and `refresh_token`.

### `POST /api/auth/logout`

Body:

```json
{
  "refresh_token": "jwt"
}
```

Returns `{ "status": 1 }`.

## OTP APIs

### `POST /api/otp/verify-otp`

Body:

```json
{
  "email": "test@example.com",
  "otp": "123456"
}
```

### `POST /api/otp/resend-otp`

Body:

```json
{
  "email": "test@example.com"
}
```

### `POST /api/otp/reset-password`

Body:

```json
{
  "email": "test@example.com"
}
```

This currently sends an OTP. It does not complete password update by itself.

## Role APIs

### `GET /api/role/get-role`

Returns all hotel roles.

### `POST /api/role/add-role`

Body:

```json
{
  "name": "hotel_manager"
}
```

### `PUT /api/role/role/:id`

Body:

```json
{
  "name": "hotel_admin"
}
```

## Admin Hotel APIs

Admin routes require `Authorization: Bearer <admin or super_admin token>`.

### `POST /api/admin/hotel/create`

Creates an unverified hotel and attaches the owner role to an existing user.

Body:

```json
{
  "name": "New Hotel",
  "contact": "+91-9876543210",
  "ownerEmail": "owner@demo.com"
}
```

### `GET /api/admin/hotel/all`

Returns hotel dashboard rows:

```json
{
  "message": "Hotels fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Tripzy Marina Bay",
      "ownerEmail": "owner@demo.com",
      "contact": "+91-98765-10001",
      "verified": true,
      "status": "active",
      "totalRooms": 6,
      "totalBookings": 2
    }
  ]
}
```

### `PUT /api/admin/hotel/verify/:id`

Marks a hotel as verified.

## Provider Hotel APIs

Provider routes require `Authorization: Bearer <token>`.

### `GET /api/provider/my-hotels`

Returns hotels where the logged-in user has hotel access.

Response rows include:

```json
{
  "id": "uuid",
  "name": "Tripzy Marina Bay",
  "contact": "+91-98765-10001",
  "verified": true,
  "status": "active",
  "country": "India",
  "state": "Goa",
  "city": "Goa",
  "totalRooms": 6,
  "totalBookings": 2
}
```

### `PUT /api/provider/updateStatus/:id`

Body:

```json
{
  "status": "active"
}
```

Allowed status values from schema: `active`, `inactive`.

### `POST /api/provider/:hotelId/submit-verification`

Multipart form data. Requires auth token.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `property` | JSON string | Property details |
| `policies` | JSON string | Check-in/check-out/refund/cancellation |
| `amenityIds` | JSON string array | IDs from amenities API |
| `documentTypes` | string or array | `license`, `tax`, `id`, `other` |
| files | multipart files | Uploaded through configured `uploadMultiple` middleware |

Example string fields:

```json
{
  "property": "{\"title\":\"Beach Stay\",\"description\":\"Sea view rooms\",\"address\":\"Candolim\",\"city\":\"Goa\",\"state\":\"Goa\",\"country\":\"India\",\"zip\":\"403516\",\"location\":\"15.5525,73.7517\"}",
  "policies": "{\"checkInTime\":\"14:00\",\"checkOutTime\":\"11:00\",\"cancellationPolicy\":\"Free cancellation before 48 hours\",\"refundPolicy\":\"Refund in 5-7 days\"}",
  "amenityIds": "[\"amenity-uuid-1\",\"amenity-uuid-2\"]",
  "documentTypes": ["license", "tax"]
}
```

## Amenities APIs

### `GET /api/admin/aminities/all`

Public in current code. Returns all amenities sorted by name.

### `POST /api/admin/aminities/create`

Admin guarded.

Body:

```json
{
  "name": "Rooftop Pool"
}
```

## Health APIs

### `GET /`

Simple welcome response.

### `GET /health`

Returns server status, environment, uptime, and timestamp.

## Already Done

- Express app setup with helmet, CORS, passport init, cookies, JSON body parsing, compression, and development logging.
- Auth register, login, token refresh, logout.
- Email OTP verify, resend, and reset-password OTP send.
- Role create, list, and update.
- Admin hotel create, list dashboard rows, and verify hotel.
- Provider hotel list, update status, and submit verification metadata/documents.
- Amenities list and create.
- Drizzle schemas for hotels, properties, rooms, bookings, images, reviews, amenities, policies, documents, payments, payouts, favorites, users, roles, and permissions.
- Seed data for users, roles, permissions, amenities, and frontend demo hotels/properties/rooms.

## Still Missing For Frontend

- Public hotel/property search and listing API.
- Public property detail API with nested hotel, rooms, images, amenities, policies, reviews, and availability.
- Room availability search by date/time/city.
- Booking create/update/cancel endpoints.
- Payment checkout/webhook endpoints.
- Favorites endpoints.
- Reviews create/list endpoints.
- User profile endpoints.
- Admin/provider APIs for CRUD on properties, rooms, room images, policies, and amenities after initial verification.
- Error handler is imported in places but not mounted globally in `app.ts`.
