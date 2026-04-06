#!/usr/bin/env bash
set -euo pipefail

workflow=".github/workflows/deploy-static.yml"

if [ ! -f "${workflow}" ]; then
  echo "Missing workflow file: ${workflow}" >&2
  exit 1
fi

missing=0

has_line() {
  local needle="$1"
  if command -v rg >/dev/null 2>&1; then
    rg -q --fixed-strings -- "${needle}" "${workflow}"
    return
  fi
  grep -Fq -- "${needle}" "${workflow}"
}

require_line() {
  local needle="$1"
  local description="$2"
  if ! has_line "${needle}"; then
    echo "Missing deploy guardrail: ${description}" >&2
    missing=1
  fi
}

require_line "branches:" "main branch trigger section present"
require_line "- main" "deploy trigger pinned to main"
require_line "workflow_dispatch:" "manual deploy trigger available"
require_line 'DEPLOY_BRANCH="hostinger-static"' "deploy branch pinned to hostinger-static"
require_line "test -d out" "out directory existence check"
require_line "test -f out/index.html" "out/index.html existence check"
require_line 'cp -R "${GITHUB_WORKSPACE}/out/." "${TMP_DIR}/"' "publish copies only static out output"

forbidden=0

forbidden_line() {
  local needle="$1"
  local description="$2"
  if has_line "${needle}"; then
    echo "Forbidden deploy content found: ${description}" >&2
    forbidden=1
  fi
}

forbidden_line "FTP_" "FTP environment variables"
forbidden_line "lftp" "FTP transfer command"
forbidden_line "mirror --reverse" "FTP mirror command"

if [ "${missing}" -ne 0 ] || [ "${forbidden}" -ne 0 ]; then
  exit 1
fi

echo "Deploy workflow guardrails passed."
