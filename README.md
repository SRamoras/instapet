# InstaPet 🐾

A social media platform for pet lovers — share photos, follow other pet owners, like and comment on posts, and discover new animals through hashtags.

Built as the final project for **Project I — Web Programming**, ETIC_Algarve, Academic Year 2025/26 (Class 2527, Group 4, Path A).

---

## Authors & Contributions

| Student | Primary responsibilities |
|---------|--------------------------|
| **Diogo Silva** | Backend (FastAPI routers, authentication, data models, upload), Docker setup, API design, security hardening |
| **Cléber Fernandes** | Frontend (Web Components, feed layout, UI styling, design system), search and profile pages |

Both members contributed to integration, testing, and Git workflow throughout the project.

---

## Original Design Reference

This project is the functional MVP of the **InstaPet** concept developed during the Web Design module. The original static design (Figma prototype) served as the visual source of truth for layout, colour palette, typography, and component structure throughout development.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JS · Web Components · HTML/CSS |
| Backend | Python 3.12 · FastAPI · SQLModel |
| Database | SQLite |
| Auth | JWT (HS256) · bcrypt |
| Runtime | Docker · Docker Compose · nginx |
| Package manager | uv |

> **Why FastAPI instead of Django?** FastAPI was chosen for its lightweight footprint and native async support, which made it easier to build and reason about each endpoint individually — aligned with the learning goal of understanding what every line of code does.

> **Why SQLite?** The project scope fits comfortably within SQLite's capabilities. Using a file-based database also simplifies the Docker setup (no separate database container needed) and keeps the data model easy to inspect and reset during development.

---

## Features

- **Authentication** — register, login, JWT-protected routes, password show/hide toggle
- **Feed** — chronological feed with filter widget (all posts vs. following only) and explore (posts from unfollowed users)
- **Posts** — create posts with caption, hashtags, and required image upload; edit and delete own posts
- **Likes & Saves** — like or bookmark any post; saved posts sorted by save date and accessible from profile
- **Comments** — add and delete comments per post
- **Profiles** — avatar, bio, Gostos/Seguidores/A seguir counters, post grid with tabs (posts / saved)
- **Follow system** — follow/unfollow from feed postcards, search, and profile; optimistic counter updates with rollback
- **Followers/following popup** — click follower or following count to open a modal list of users with inline follow buttons
- **Notifications** — real-time badge on navbar; triggered by likes, comments, and follows; auto-marked as read on panel open; clear all
- **Hashtag links** — `#tag` in any caption becomes a clickable link to search results
- **Tag filtering** — right sidebar shows trending tags; click to filter the feed
- **Search** — search posts by hashtag; follow users directly from results
- **404 page** — custom branded page for unknown routes
- **Image uploads** — JPEG/PNG/GIF/WebP, max 10 MB, served as static files
- **Terms & FAQ** — dedicated page in Portuguese with accordion FAQ

---

## Project Structure

```
instapet/
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT creation, password hashing, auth dependencies
│   │   ├── database/      # DB initialisation and seed script
│   │   ├── models/        # SQLModel tables: User, Post, Like, Save, Comment, Follow, Tag, PostTag, Notification
│   │   ├── routers/       # FastAPI routers: auth, posts, users, upload, notifications
│   │   └── schemas/       # Pydantic request/response schemas
│   ├── imgs/              # Uploaded images served as static files at /imgs/
│   ├── .env               # Environment variables (not committed — see .env.example)
│   └── Dockerfile
├── frontend/
│   ├── pages/             # HTML pages: feed, login, register, profile, post, search, terms, 404
│   ├── services/          # JS API client modules: api, auth, posts, users, upload, notifications
│   ├── webcomponent/      # Custom Web Components: navbar, footer, postcard, forms, sidebars…
│   └── Dockerfile
├── docker-compose.yml
└── makefile
```

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2
- `make`

### Environment variables

Create `backend/.env` before running:

```env
JWT_SECRET=change_me_to_a_long_random_string
```

### Run locally

```bash
# Clone the repo
git clone https://github.com/SRamoras/instapet.git
cd instapet

# Build images, start containers, and seed the database with sample data
make start
```

The app will be available at:

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:8000 |
| Interactive API docs (Swagger) | http://localhost:8000/docs |

### Makefile reference

```makefile
sync:
	cd backend && uv sync

start:
	cd backend && uv sync
	docker compose down --remove-orphans
	docker compose build --no-cache
	docker compose up -d
	docker compose exec -T backend uv run python -m app.database.seed

seed:
	docker compose exec -T backend uv run python -m app.database.seed

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up -d --build

restart:
	docker compose down && docker compose up -d --build

logs:
	docker compose logs -f

clean:
	docker compose down --volumes --rmi all
```

| Command | What it does |
|---------|-------------|
| `make start` | Fresh build — rebuilds images, starts containers, seeds demo data |
| `make up` | Start existing containers without rebuilding |
| `make down` | Stop containers |
| `make build` | Rebuild and start |
| `make restart` | Stop, rebuild from scratch, and start |
| `make logs` | Tail all container logs |
| `make seed` | Re-run the database seed script against running containers |
| `make sync` | Install/update Python dependencies locally via `uv sync` |
| `make clean` | Remove all containers, volumes, and images |

---

## API Overview

**Auth**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Login, returns JWT |

**Posts**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts/` | optional | List all posts (filterable by `?tag=`, `?skip=`, `?limit=`) |
| POST | `/posts/` | required | Create post |
| GET | `/posts/feed` | required | Posts from followed users only |
| GET | `/posts/explore` | required | Posts from unfollowed users |
| GET | `/posts/tags` | — | Top trending tags |
| GET | `/posts/saved` | required | Posts saved by the current user (sorted by save date) |
| GET | `/posts/{id}` | optional | Get a single post |
| PATCH | `/posts/{id}` | required | Edit own post |
| DELETE | `/posts/{id}` | required | Delete own post |
| POST | `/posts/{id}/like` | required | Like a post |
| DELETE | `/posts/{id}/like` | required | Unlike a post |
| POST | `/posts/{id}/save` | required | Save a post |
| DELETE | `/posts/{id}/save` | required | Unsave a post |
| GET | `/posts/{id}/comments` | — | List comments on a post |
| POST | `/posts/{id}/comments` | required | Add a comment |
| DELETE | `/posts/{id}/comments/{comment_id}` | required | Delete own comment |

**Users**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/` | optional | List all users (excludes self) |
| GET | `/users/me` | required | Get own profile |
| PATCH | `/users/me` | required | Update own profile |
| GET | `/users/{username}` | optional | Get user profile by username |
| GET | `/users/{username}/followers` | optional | List followers of a user |
| GET | `/users/{username}/following` | optional | List users followed by a user |
| POST | `/users/{username}/follow` | required | Follow a user |
| DELETE | `/users/{username}/follow` | required | Unfollow a user |

**Notifications**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | required | List own notifications (latest 30) |
| POST | `/notifications/read-all` | required | Mark all notifications as read |
| DELETE | `/notifications/all` | required | Delete all notifications |

**Upload**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload/` | required | Upload image (JPEG/PNG/GIF/WebP, max 10 MB) — returns `{ url }` |

Full interactive docs at http://localhost:8000/docs (Swagger UI).

---

## AI Usage

> This section is required by the Project I brief (NFR-07, section 10). All AI-assisted work is declared below. Every line of code in this repository was read, understood, and verified by the student who committed it before being merged.

### Tool used

**Claude Code** (Anthropic) — AI coding assistant used interactively throughout the project via the CLI.

**ChatGPT** (OpenAI) — used for research, concept clarification, and exploring alternative approaches
### Declaration by area

| Area | Purpose | Rough scope |
|------|---------|-------------|
| Backend project structure | Scaffolding the FastAPI folder layout (routers/, models/, schemas/, auth/) and wiring the app entry point (`main.py`) | Initial scaffold; manually adjusted throughout |
| SQLModel data models | First draft of `User`, `Post`, `Like`, `Save`, `Comment`, `Follow`, `Tag`, `PostTag`, `Notification` models and their field types/constraints | AI-drafted, reviewed and corrected by Diogo |
| JWT authentication | Implementation of `hash_password`, `verify_password`, `create_access_token`, `decode_access_token` in `auth/jwt.py` and the `get_current_user` dependency |  AI-drafted |
| FastAPI routers | First pass of all CRUD endpoints in `routers/posts.py`, `routers/users.py`, `routers/auth.py`; `_enrich_post` and `_enrich_user` helper pattern | AI-drafted, then debugged and extended manually |
| Security hardening | Identifying that `JWT_SECRET` was hardcoded → moved to `os.environ["JWT_SECRET"]`; flagging `innerHTML` XSS risk → replaced with `textContent`/`createElement`; removing debug logs | Identified by Claude, applied and verified by Diogo |
| Web Components (frontend) | Initial shell of `<post-card>`, `<feed-sidebar-left>`, `<feed-sidebar-right>`, `<post-form>`, `<nav-bar>` and others using the native Web Components API | AI-drafted, styled and adjusted by Cléber |
| JS service layer | First draft of `services/api.js`, `posts.js`, `users.js`, `upload.js` — thin wrappers around `fetch` | AI-drafted, reviewed and extended by Cléber |
| Custom DOM events | Pattern for inter-component communication (`post-submit`, `post-like`, `post-save`, `sidebar-follow-change`) | Suggested by Claude, implemented and tested manually |
| Bug fixes | Diagnosing stale-data navigation bug → `feed-stale` sessionStorage flag + `pageshow` handler; follow count live-update without reload | Root cause identified by Claude, fix written and verified manually |
| Docker & Makefile | `docker-compose.yml` structure, `Dockerfile` for each service, `makefile` targets | AI-drafted, tested and corrected locally |
| CSS design tokens | Applying consistent CSS custom properties across all components | Suggested by Claude, applied and validated visually by Cléber |
| README | Drafting and structuring this README, API table, and AI Usage section | AI-drafted, reviewed and edited by both authors |
| Seed data | First draft of `app/database/seed.py` content — pet usernames, bios, post captions, comments, follow/notification sample data | AI-drafted, reviewed and edited by both authors |

### Declaration by Phase 2 deliverable

> Mapping the AI Usage declaration onto the Phase 2 checklist. AI (Claude Code, ChatGPT) was used to a meaningful degree across every deliverable below; all output was reviewed, corrected, and verified by the authors before being committed.

| Phase 2 deliverable | AI usage |
|---|---|
| Final list of pages and user flows derived from the design | AI helped consolidate the Figma design into the final list of pages (auth, feed, profile, post detail, notifications, search) and their user flows; reviewed and adjusted by the authors |
| Data model: ER diagram covering the main domain entities | AI-drafted the entity-relationship reasoning for `User`, `Post`, `Like`, `Save`, `Comment`, `Follow`, `Tag`, `PostTag`, `Notification` and their relationships; corrected and finalised manually |
| Initial project created, with models defined and migrations in place | AI scaffolded the backend project (FastAPI instead of Django, see [Tech Stack](#tech-stack)) and drafted the SQLModel models; tables are created via `SQLModel.metadata.create_all`, so no separate migration tool is needed |
| Working `docker-compose.yml` running at least the app service and the database | AI-drafted `docker-compose.yml` and the `Dockerfile`s for the frontend/backend services; the database is file-based SQLite, so it runs inside the backend container rather than as a separate service |
| Repository structure, `README.md`, `.env.example`, contribution/workflow note | AI-drafted the folder layout, this README, and `.env.example`; reviewed and edited by both authors |
| Core pages implemented in HTML/CSS/JS, faithful to the design | AI-drafted the initial Web Components shell (`<post-card>`, `<feed-sidebar-left>`, `<feed-sidebar-right>`, `<post-form>`, `<nav-bar>`, etc.); styled and adjusted by Cléber to match the design |
| Views, URLs and templates (FastAPI routers/JS service layer) wired up for the main user flows | AI-drafted the FastAPI routers and the JS service layer (`services/api.js`, `posts.js`, `users.js`, `upload.js`) connecting the frontend flows to backend endpoints |
| CRUD working for the main domain entities | AI-drafted CRUD endpoints in `routers/posts.py`, `routers/users.py`, `routers/auth.py`; debugged and extended manually |
| Data persisted and retrieved from the database correctly | AI-drafted SQLModel queries and the `_enrich_post`/`_enrich_user` helper pattern; correctness verified manually against the database |
| `docker compose up` brings the full stack up cleanly from a fresh clone | AI-drafted and iteratively corrected the Docker/Makefile setup until a clean `docker compose up` from a fresh clone was achieved |
| Feature completeness against the Phase 1 scope | AI used throughout to turn Phase 1 features into working code; scope and prioritisation decisions made by the authors |
| Input validation and basic error handling | AI suggested Pydantic/SQLModel validation and FastAPI exception-handling patterns; security gaps it flagged (hardcoded JWT secret, `innerHTML` XSS risk) were fixed manually |
| Responsiveness verified on desktop, tablet and mobile | AI suggested the CSS design tokens and media-query patterns used across components; responsiveness itself was visually verified on multiple breakpoints by Cléber |
| Documentation (installation, usage, stack overview) finalised | AI-drafted this README, including installation steps, usage instructions, and the stack overview; reviewed and edited by both authors |
| Recorded product demo and final rehearsal | Not AI-assisted — the demo recording and presentation rehearsal were done by the authors |

### How AI was used as a learning aid

- Claude was used conversationally: we described what we wanted to build, read and questioned the output, then modified it before committing. Anything we couldn't explain we either researched until we could, or rewrote ourselves.
- When Claude proposed a pattern we hadn't seen before (e.g., `_enrich_post` helper, `asynccontextmanager` for FastAPI lifespan), we asked it to explain why before accepting the code.
- Security issues were flagged by Claude during code review prompts — this reinforced understanding of JWT secret management and XSS risks rather than bypassing it.
- No code was committed with the reasoning "the AI wrote it" — the commit history reflects iterative, understood changes.

### What was done without AI assistance

- Project concept, feature scope, and design decisions
- Visual design direction, colour palette, and Figma artefact (Web Design module)
- Git branching strategy, pull request reviews, and merge decisions
- Integration testing and manual QA of all user flows
- Final debugging sessions where Claude's suggestions were incorrect and discarded

