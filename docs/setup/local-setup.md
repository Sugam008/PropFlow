# Local Setup Guide

This guide provides instructions for setting up the PropFlow development environment on your local machine.

## Prerequisites

- **Node.js**: Version 18.x or higher.
- **PNPM**: Version 8.x or higher.
- **Python**: Version 3.11.
- **Docker & Docker Compose**: For running local infrastructure (PostgreSQL, Redis, MinIO).

## Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd PropFlow
   ```

2. **Install Workspace Dependencies**:
   ```bash
   pnpm install
   ```

3. **Set Up Python Environment**:
   The backend requires Python 3.11 and dependencies. Set up a virtual environment:
   ```bash
   cd backend
   python3.11 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install --upgrade pip
   pip install -r requirements.txt
   cd ..
   ```
   
   **Note**: Keep the virtual environment activated when running backend commands or tests.

4. **Initialize Infrastructure and Environment**:
   Run the development start script:
   ```bash
   ./scripts/dev-start.sh
   ```
   This script performs the following:
   - Starts Docker containers for DB, Redis, and MinIO.
   - Waits for the database to be healthy.
   - Creates local `.env` files from `.env.example` templates if they don't exist.

5. **Verify Tooling**:
   Ensure all linters and formatters are working:
   ```bash
   pnpm lint
   pnpm type-check
   ```
   
   For backend verification (with Python venv activated):
   ```bash
   cd backend
   ruff check .
   mypy app --ignore-missing-imports
   pytest -q
   ```

6. **Start Development Servers**:
   ```bash
   pnpm dev
   ```

## Troubleshooting

- **Docker Connection**: If `dev-start.sh` fails to connect to Docker, ensure Docker Desktop is running.
- **Port Conflicts**: Ensure ports 5432 (Postgres), 6379 (Redis), and 9000/9001 (MinIO) are available.
