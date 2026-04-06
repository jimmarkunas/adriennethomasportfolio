#!/usr/bin/env bash
set -euo pipefail

route="${1:-/}"
base_url="${BASE_URL:-http://localhost:3000}"
log_file="${DEV_LOG_FILE:-/tmp/portfolio-dev.log}"
tail_lines="${DEV_LOG_LINES:-40}"

if [[ "$route" != /* ]]; then
  route="/$route"
fi

if ! [[ "$tail_lines" =~ ^[0-9]+$ ]]; then
  echo "DEV_LOG_LINES must be a positive integer." >&2
  exit 1
fi

url="${base_url%/}${route}"

echo "Route check: ${url}"
http_code="$(curl --silent --show-error --max-time 10 --output /dev/null --write-out "%{http_code}" "${url}" || true)"

if [[ "$http_code" == "200" ]]; then
  echo "Status: 200 OK"
else
  echo "Status: ${http_code} (expected 200)."
  echo "The dev server may be down, still compiling, or the route may be invalid."
  exit 1
fi

if [[ -f "$log_file" ]]; then
  echo
  echo "Dev log tail (${tail_lines} lines): ${log_file}"
  tail -n "$tail_lines" "$log_file"
else
  echo
  echo "Dev log file not found: ${log_file}"
  echo "Set DEV_LOG_FILE to your log path if you want log tails in this command."
fi
