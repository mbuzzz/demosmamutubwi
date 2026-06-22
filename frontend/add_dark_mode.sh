#!/bin/bash
find src/pages/admin -type f -name "*.tsx" ! -path "*/cbt/*" | while read file; do
  sed -i 's/bg-white/bg-white dark:bg-slate-900/g' "$file"
  sed -i 's/bg-slate-50/bg-slate-50 dark:bg-slate-800\/50/g' "$file"
  sed -i 's/border-slate-100/border-slate-100 dark:border-slate-800/g' "$file"
  sed -i 's/border-slate-200/border-slate-200 dark:border-slate-700/g' "$file"
  sed -i 's/text-slate-800/text-slate-800 dark:text-white/g' "$file"
  sed -i 's/text-slate-700/text-slate-700 dark:text-slate-200/g' "$file"
  sed -i 's/text-slate-600/text-slate-600 dark:text-slate-300/g' "$file"
  sed -i 's/text-slate-500/text-slate-500 dark:text-slate-400/g' "$file"
  sed -i 's/text-slate-400/text-slate-400 dark:text-slate-500/g' "$file"
  
  # Clean up duplicate dark mode classes if run multiple times or if already present
  sed -i 's/dark:bg-slate-900 dark:bg-slate-900/dark:bg-slate-900/g' "$file"
  sed -i 's/dark:bg-slate-800\/50 dark:bg-slate-800\/50/dark:bg-slate-800\/50/g' "$file"
  sed -i 's/dark:border-slate-800 dark:border-slate-800/dark:border-slate-800/g' "$file"
  sed -i 's/dark:border-slate-700 dark:border-slate-700/dark:border-slate-700/g' "$file"
  sed -i 's/dark:text-white dark:text-white/dark:text-white/g' "$file"
  sed -i 's/dark:text-slate-200 dark:text-slate-200/dark:text-slate-200/g' "$file"
  sed -i 's/dark:text-slate-300 dark:text-slate-300/dark:text-slate-300/g' "$file"
  sed -i 's/dark:text-slate-400 dark:text-slate-400/dark:text-slate-400/g' "$file"
  sed -i 's/dark:text-slate-500 dark:text-slate-500/dark:text-slate-500/g' "$file"
done
