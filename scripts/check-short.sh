#!/usr/bin/env bash
set -euo pipefail

label="${1:-check}"
shift || true

if [ "$#" -eq 0 ]; then
  echo "Usage: scripts/check-short.sh <label> <command> [args...]" >&2
  exit 1
fi

tail_lines="${SHORT_LOG_LINES:-40}"
log_dir="${SHORT_LOG_DIR:-/tmp/portfolio-checks}"
mkdir -p "${log_dir}"

timestamp="$(date +%Y%m%d-%H%M%S)"
safe_label="$(printf "%s" "${label}" | tr -cs 'A-Za-z0-9._-' '-')"
log_file="${log_dir}/${safe_label}-${timestamp}.log"

set +e
"$@" >"${log_file}" 2>&1
status=$?
set -e

echo "[${label}] exit=${status}"
echo "[${label}] log=${log_file}"
echo "[${label}] tail(${tail_lines}):"
tail -n "${tail_lines}" "${log_file}" || true

exit "${status}"
