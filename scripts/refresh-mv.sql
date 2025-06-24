-- Run with: supabase db query < scripts/refresh-mv.sql
call public.refresh_time_tracked_mv(); 
