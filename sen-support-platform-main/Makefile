.PHONY: help test lint run

help:
	@echo "Available targets:"
	@echo "  test  Run Go tests and frontend tests when configured"
	@echo "  lint  Run go vet and configured frontend ESLint"
	@echo "  run   Start the frontend development server"

test:
	cd backend && go test ./...
	@if node -e "process.exit(require('./frontend/package.json').scripts?.test ? 0 : 1)"; then npm --prefix frontend test --if-present; else echo "Skipping frontend tests: no test script configured."; fi

lint:
	cd backend && go vet ./...
	@if node -e "process.exit(require('./frontend/package.json').scripts?.lint ? 0 : 1)"; then npm --prefix frontend run lint; else echo "Skipping frontend lint: no lint script configured."; fi

run:
	npm --prefix frontend run dev
