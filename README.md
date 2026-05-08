The Alter Office — lightweight Todo app

A simple, student-friendly MERN Todo app. Quick to run and easy to explain.

Quick start

- Backend:

	1. Copy `Backend/.env.example` -> `Backend/.env` and fill values (do not commit).
	2. Run:

```bash
cd Backend
npm install
npm run dev
```

- Frontend:

	1. (Optional) set `Frontend/.env` with `VITE_API_URL`.
	2. Run:

```bash
cd Frontend
npm install
npm run dev
```

Notes

- Set `MONGO_URI` and `JWT_SECRET` in `Backend/.env` before running the app.
- Todo routes are protected; use the JWT returned from login in the `Authorization: Bearer <token>` header.

Want help deploying or securing passwords? Tell me which platform and I’ll add steps.
