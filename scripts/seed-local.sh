#!/usr/bin/env bash
set -e

supabase db reset --pipeline supabase/migrations
echo "Running seed..."
supabase db query < supabase/migrations/003_seed.sql
echo "Done ✅" 
