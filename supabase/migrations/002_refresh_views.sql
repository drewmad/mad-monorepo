-- Enable pg_cron extension
create extension if not exists pg_cron with schema extensions;

-- Function to refresh KPI materialized view
create or replace function public.refresh_time_tracked_mv()
returns void
language plpgsql
as $$
begin
  refresh materialized view concurrently public.time_tracked_last_30_days;
end;
$$;

-- Schedule nightly refresh at 02:00 UTC
select cron.schedule(
  'refresh_time_tracked_mv',
  '0 2 * * *',
  $$ call public.refresh_time_tracked_mv(); $$
); 