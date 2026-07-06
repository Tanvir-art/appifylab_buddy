# Buddy - Social Media App

A full-stack social media application built with Node.js 22, Express, PostgreSQL, and React.

---

## What I Built & Decisions Made

**Features implemented:**
- Register / Login / Logout with JWT (access token 15m, refresh token 7d)
- Create, update, soft-delete posts with optional image upload
- Comment on posts, reply on comments
- Like/unlike posts, comments, and replies
- User profile view and update with profile image upload

**Key decisions:**
- **Refresh token rotation** — old refresh token is deleted and a new one is issued on every `/refresh` call, stored in DB for revocation support
- **Soft delete on posts** — `deleted_at` column instead of hard delete, so existing comments/likes stay intact
- **DB triggers for counts** — `like_count`, `comment_count`, `reply_count` are maintained by PostgreSQL triggers, not application code, ensuring consistency under concurrent requests
- **Cursor-based pagination for comments/replies** — uses `created_at` as cursor for stable results; post feed uses offset-based pagination
- **Multer + Sharp** — uploaded images are processed and resized before saving to `uploads/`
- **Zod validation** — all request bodies validated before reaching the controller
- **Module-based structure** — each feature (auth, post, comment, reply, like, user) has its own routes, controller, service, model, and validation file

---

## Architecture

```
.
├── backend/          # Node.js 22 + Express API
│   ├── src/
│   │   ├── config/       # DB, env, multer config
│   │   ├── middleware/   # Auth, error handling
│   │   ├── modules/      # Feature modules (auth, post, comment, reply, like, user)
│   │   └── utils/        # Logger, helpers
│   └── uploads/          # Uploaded images
├── front_end/        # React 19 + Vite
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── services/     # Axios API calls
└── docker-compose.yml
```

---

## Backend Setup

### Prerequisites
- Node.js 22
- PostgreSQL 16

### Run Locally

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=buddy
DB_PASSWORD=buddy
DB_NAME=buddy

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:5000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads/
```

Start the server:

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

Health check: `GET http://localhost:5000/health`

---

## Database

### Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (id, first_name, last_name, email, password_hash, profile_image) |
| `refresh_tokens` | JWT refresh tokens (user_id, token, expires_at) |
| `posts` | Posts (user_id, content, image_url, visibility, like_count, comment_count, deleted_at) |
| `comments` | Comments on posts (post_id, user_id, content, reply_count, like_count) |
| `replies` | Replies on comments (comment_id, user_id, content, like_count) |
| `post_likes` | Post likes (user_id, post_id) — unique constraint |
| `comment_likes` | Comment likes (user_id, comment_id) — unique constraint |
| `reply_likes` | Reply likes (user_id, reply_id) — unique constraint |

### Triggers

The following triggers are active in the database:

**Comment triggers:**
- `after_comment_insert` → `posts.comment_count` +1 when a comment is added
- `after_comment_delete` → `posts.comment_count` -1 when a comment is deleted

**Reply triggers:**
- `after_reply_insert` → `comments.reply_count` +1 when a reply is added
- `after_reply_delete` → `comments.reply_count` -1 when a reply is deleted

**Like triggers:**
- `after_post_like_insert` → `posts.like_count` +1
- `after_post_like_delete` → `posts.like_count` -1
- `after_comment_like_insert` → `comments.like_count` +1
- `after_comment_like_delete` → `comments.like_count` -1
- `after_reply_like_insert` → `replies.like_count` +1
- `after_reply_like_delete` → `replies.like_count` -1

### Create Database

```bash
psql -U postgres
CREATE USER buddy WITH PASSWORD 'buddy';
CREATE DATABASE buddy OWNER buddy;
\q
```

Then run your SQL migration/schema file to create tables and triggers.

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update profile |
| GET | `/api/posts` | Get feed |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| GET | `/api/comments/:postId` | Get comments |
| POST | `/api/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment |
| GET | `/api/replies/:commentId` | Get replies |
| POST | `/api/replies` | Add reply |
| POST | `/api/likes/post/:id` | Like/unlike post |
| POST | `/api/likes/comment/:id` | Like/unlike comment |
| POST | `/api/likes/reply/:id` | Like/unlike reply |

---

## Frontend Setup

### Prerequisites
- Node.js 22

### Run Locally

```bash
cd front_end
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start dev server:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Run with Docker

```bash
# Copy and fill env values
cp .env.example .env

docker compose up --build
```

- Frontend: `http://localhost`
- Backend: `http://localhost:5000`
- PostgreSQL: port `5432`
