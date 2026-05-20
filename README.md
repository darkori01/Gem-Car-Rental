# Gem Car Rental Backend + Frontend

Assist in tracking activities of rented vehicles.

This folder contains the Gem Car Rental management system with an admin side, customer side, authentication, password recovery flow, and a small Node backend.

## Run

```bash
node server.js
```

Open:

```text
http://localhost:4174
```

## Login accounts

- Admin: `admin@gemcarrental.com` / `GemAdmin2026!`
- Customer: `maya@gemcarrental.com` / `GemCustomer2026!`

## API

- `GET /api/health`
- `GET /api/bootstrap`
- `GET /api/vehicles`
- `POST /api/vehicles`
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/customers`
- `GET /api/payments`
- `GET /api/maintenance`
- `POST /api/export`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`

The backend uses in-memory data so it is easy to run locally and extend. The next production step would be replacing the arrays in `server.js` with a database layer such as SQLite or PostgreSQL.
