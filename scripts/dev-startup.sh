#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_URL="http://localhost:3000/"
PORT=3000

is_healthy() {
  curl -fsS --max-time 1 "$APP_URL" >/dev/null 2>&1
}

listener_pid() {
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null | head -n 1
}

ensure_dev() {
  if is_healthy; then
    echo "DEV_SERVER_ALREADY_RUNNING"
    exit 0
  fi

  local pid
  pid="$(listener_pid || true)"

  if [[ -n "${pid:-}" ]]; then
    echo "Port $PORT is already in use by PID $pid, but $APP_URL is not healthy." >&2
    echo "Stop the stale process or free port $PORT before reopening the workspace." >&2
    exit 1
  fi

  echo "STARTING_DEV_SERVER"
  cd "$ROOT_DIR"
  exec npm run dev
}

open_browser() {
  local attempts=30

  for ((i = 1; i <= attempts; i++)); do
    if is_healthy; then
      osascript "$ROOT_DIR/scripts/open-simple-browser.applescript"
      exit 0
    fi

    sleep 1
  done

  echo "Timed out waiting for $APP_URL to become ready." >&2
  exit 1
}

case "${1:-}" in
  ensure-dev)
    ensure_dev
    ;;
  open-browser)
    open_browser
    ;;
  *)
    echo "Usage: $0 {ensure-dev|open-browser}" >&2
    exit 1
    ;;
esac
