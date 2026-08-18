#!/usr/bin/env bash
set -euo pipefail
base="${1:-http://127.0.0.1:3100}"
failed=0
printf '%-5s %s\n' 'CODE' 'ROUTE'
while IFS= read -r route; do
  code=$(curl -sS -o /tmp/toolsuite-route-response.html -w '%{http_code}' "$base$route")
  printf '%-5s %s\n' "$code" "$route"
  if [[ "$code" != "200" ]]; then failed=$((failed + 1)); fi
done < <(printf '/\n'; grep -o "slug: '[^']*'" client/src/original/constants/tools.ts | sed "s/slug: '//;s/'$//")
if [[ "$failed" -ne 0 ]]; then
  echo "$failed route checks failed" >&2
  exit 1
fi
