#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="pre-phase1"
if [[ $# -ge 1 ]]; then
  STAGE="$1"
fi

case "${STAGE}" in
  pre-phase1|pre-phase8|post-phase8)
    ;;
  *)
    echo "Usage: bash customer-portal-execution-kit/10-preflight-check.sh [pre-phase1|pre-phase8|post-phase8]"
    exit 2
    ;;
esac

base_hard_paths=(
  "frontend/apps/valuer-dashboard"
  ".github/workflows"
  "scripts"
  "README.md"
  "SETUP-GUIDE.md"
)

hard_files=(
  "frontend/apps/valuer-dashboard/next.config.js"
  "frontend/apps/valuer-dashboard/tsconfig.json"
  "frontend/apps/valuer-dashboard/eslint.config.mjs"
  "frontend/apps/valuer-dashboard/.env.example"
  "frontend/apps/valuer-dashboard/app/layout.tsx"
  "frontend/apps/valuer-dashboard/src/components/ClientLayout.tsx"
  "frontend/apps/valuer-dashboard/src/components/Sidebar.tsx"
  "frontend/apps/valuer-dashboard/src/components/TopBar.tsx"
  "frontend/apps/valuer-dashboard/app/globals.css"
  "frontend/apps/valuer-dashboard/app/login/page.tsx"
  "frontend/apps/valuer-dashboard/src/store/useAuthStore.ts"
)

soft_files=(
  "plan-claude.md"
)

missing=0

echo "[preflight] repo root: ${ROOT_DIR}"
echo "[preflight] stage: ${STAGE}"

echo "[preflight] checking base hard paths..."
for p in "${base_hard_paths[@]}"; do
  if [[ ! -e "${ROOT_DIR}/${p}" ]]; then
    echo "MISSING HARD PATH: ${p}"
    missing=1
  fi
done

echo "[preflight] checking stage-specific app paths..."
if [[ "${STAGE}" == "pre-phase1" ]]; then
  if [[ ! -d "${ROOT_DIR}/frontend/apps/customer-app" ]]; then
    echo "MISSING HARD PATH: frontend/apps/customer-app (required before migration starts)"
    missing=1
  fi
fi

if [[ "${STAGE}" == "pre-phase8" ]]; then
  if [[ ! -d "${ROOT_DIR}/frontend/apps/customer-app" ]]; then
    echo "MISSING HARD PATH: frontend/apps/customer-app (required before decommission)"
    missing=1
  fi
  if [[ ! -d "${ROOT_DIR}/frontend/apps/customer-portal" ]]; then
    echo "MISSING HARD PATH: frontend/apps/customer-portal (expected before decommission)"
    missing=1
  fi
fi

if [[ "${STAGE}" == "post-phase8" ]]; then
  if [[ -d "${ROOT_DIR}/frontend/apps/customer-app" ]]; then
    echo "UNEXPECTED PATH PRESENT: frontend/apps/customer-app (should be deleted after decommission)"
    missing=1
  fi
  if [[ ! -d "${ROOT_DIR}/frontend/apps/customer-portal" ]]; then
    echo "MISSING HARD PATH: frontend/apps/customer-portal (must exist after decommission)"
    missing=1
  fi
fi

echo "[preflight] checking hard files..."
for f in "${hard_files[@]}"; do
  if [[ ! -f "${ROOT_DIR}/${f}" ]]; then
    echo "MISSING HARD FILE: ${f}"
    missing=1
  fi
done

echo "[preflight] checking soft files..."
for f in "${soft_files[@]}"; do
  if [[ ! -f "${ROOT_DIR}/${f}" ]]; then
    echo "MISSING SOFT FILE: ${f} (non-blocking; use 11-local-execution-contract.md)"
  fi
done

if [[ ${missing} -ne 0 ]]; then
  echo "[preflight] FAILED: dependency checks failed"
  exit 1
fi

echo "[preflight] PASS: dependency checks passed"
