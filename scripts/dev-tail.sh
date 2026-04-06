#!/usr/bin/env bash
set -euo pipefail

log_file="${1:-/tmp/portfolio-dev.log}"
line_count="${2:-40}"

if [[ ! -f "$log_file" ]]; then
  echo "Log file not found: $log_file" >&2
  exit 1
fi

if ! [[ "$line_count" =~ ^[0-9]+$ ]]; then
  echo "Line count must be a positive integer." >&2
  exit 1
fi

tail -n "$line_count" "$log_file"
