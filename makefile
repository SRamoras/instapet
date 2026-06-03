
.PHONY: start up down build restart logs clean sync

sync:
	cd backend && uv sync

start:
	cd backend && uv sync
	docker compose down --remove-orphans
	docker compose build --no-cache
	docker compose up -d
	@echo ""
	@echo "✅  Frontend → http://localhost"
	@echo "✅  Backend  → http://localhost:8000"
	@echo ""
 
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
 