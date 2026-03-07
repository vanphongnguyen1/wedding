#!/usr/bin/env bash
# PostToolUse hook: warns when a new page is created without updating Header.tsx
# Receives JSON on stdin: { tool_name, tool_input: { file_path, content }, tool_response }

FILE=$(node -e "
  let d = '';
  process.stdin.on('data', c => d += c);
  process.stdin.on('end', () => {
    try {
      const j = JSON.parse(d);
      process.stdout.write(j.tool_input?.file_path || '');
    } catch { process.stdout.write(''); }
  });
")

if [[ "$FILE" =~ app/.+/page\.tsx$ ]]; then
  echo ""
  echo "HOOK WARNING: New page detected at '$FILE'."
  echo "ACTION REQUIRED: Add a nav link to Components/Header.tsx (navLinks array)."
  echo ""
fi
