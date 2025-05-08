# Frontend Makefile

# Variables
NODE_VERSION = 18
DOCKER_IMAGE_NAME = pvc-frontend-web
FRONTEND_DIR = .

# Create .env file from example
setup-env-fix:
	@if [ -f $(FRONTEND_DIR)/.env-example ]; then \
		sed 's/DOCUMENTS_API_URL_BASE=/REACT_APP_DOCUMENTS_API_URL_BASE=/' $(FRONTEND_DIR)/.env-example > $(FRONTEND_DIR)/.env; \
		echo "Created .env file with proper React prefixes"; \
	else \
		echo ".env-example file not found"; \
	fi


# Docker commands
docker-build:
	docker build -t $(DOCKER_IMAGE_NAME) $(FRONTEND_DIR)

docker-run:
	docker run -p 3000:5173 -v $$(pwd)/$(FRONTEND_DIR):/app -v /app/node_modules $(DOCKER_IMAGE_NAME)


# Full setup - env, install, and docker build+run
setup: setup-env docker-build docker-run

# Default help command

.PHONY: setup-env install dev build docker-build docker-run docker-install-package clean setup help