#!/usr/bin/env bash
# Writes DATABASE_URL to .env.local from the Supabase pooler string and your password.
set -euo pipefail
cd "$(dirname "$0")/.."

read -rp "Paste the Transaction pooler string from Supabase → Connect: " url
read -rsp "Type your database password (hidden): " pass; echo

enc=$(PASS="$pass" python3 -c 'import os, urllib.parse; print(urllib.parse.quote(os.environ["PASS"], safe=""))')
url=${url//\[YOUR-PASSWORD\]/$enc}
url=${url//YOUR-PASSWORD/$enc}

printf 'DATABASE_URL=%s\n' "$url" > .env.local
echo "Saved to .env.local. Paste the same value into Vercel:"
echo "$url"
