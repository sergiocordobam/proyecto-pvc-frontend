# Frontend Makefile

# Variables
NODE_VERSION = 18
DOCKER_IMAGE_NAME = pvc-frontend-web
FRONTEND_DIR = .

# Create .env file from example
setup-env-fix:
	@if [ -f $(FRONTEND_DIR)/.env-example ]; then \
		cp $(FRONTEND_DIR)/.env-example $(FRONTEND_DIR)/.env; \
		echo "Created .env file from example"; \
	else \
		echo ".env-example file not found"; \
	fi

docker-build:
	@if [ -f $(FRONTEND_DIR)/.env ]; then \
		API_URL=$$(grep REACT_APP_DOCUMENTS_API_URL_BASE $(FRONTEND_DIR)/.env | cut -d= -f2); \
		docker build \
			--build-arg REACT_APP_DOCUMENTS_API_URL_BASE="$$API_URL" \
			-t $(DOCKER_IMAGE_NAME) $(FRONTEND_DIR); \
	else \
		echo ".env file not found. Run 'make setup-env-fix' first."; \
		exit 1; \
	fi

docker-run:
	@if [ -f $(FRONTEND_DIR)/.env ]; then \
		docker run -p 3000:5173 \
			--env-file $(FRONTEND_DIR)/.env \
			-v $$(pwd)/$(FRONTEND_DIR):/app \
			-v /app/node_modules \
			$(DOCKER_IMAGE_NAME); \
	else \
		echo ".env file not found. Run 'make setup-env-fix' first."; \
		exit 1; \
	fi
# Full setup - env, install, and docker build+run
setup: setup-env docker-build docker-run

# Default help command

.PHONY: setup-env install dev build docker-build docker-run docker-install-package clean setup help