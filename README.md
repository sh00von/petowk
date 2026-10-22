# petowk — Pet Care Platform with AI Assistant

A full-stack **pet care web platform** built with **Next.js**, **MongoDB**, and **Ollama** — with user accounts, pet profiles, a personal dashboard, and an AI assistant for pet-care questions.

## Features

- **User accounts** — authentication with NextAuth (MongoDB adapter) and Auth0 support
- **Pet profiles** — Mongoose models for pets and users (`models/Pet.js`, `models/User.js`)
- **Dashboard** — signed-in area for managing your pets and account
- **AI assistant** — local LLM integration via Ollama (`lib/ollama.js`) for pet-care help
- **Modern UI** — shadcn/ui (Radix) components, Tailwind CSS, Framer Motion animations, Lottie
- **Email support** — Nodemailer integration for transactional mail
- **Safe rich text** — Markdown rendering with DOMPurify sanitization

## Tech Stack

- **Framework:** Next.js (Pages Router), React
- **Database:** MongoDB with Mongoose (+ Supabase client)
- **Auth:** NextAuth, Auth0
- **AI:** Ollama (local LLMs)
- **UI:** Tailwind CSS, shadcn/ui, Radix UI, Framer Motion, Lucide icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will need a MongoDB connection string and auth provider credentials configured in your environment (see `lib/mongodb.js` / `lib/auth.js`), plus a running [Ollama](https://ollama.com) instance for the AI assistant.

## Scripts

```bash
npm run dev    # development server
npm run build  # production build
npm run start  # start production server
npm run lint   # lint
```

---

If this project is useful to you, consider giving it a ⭐ — contributions and feedback are welcome.
