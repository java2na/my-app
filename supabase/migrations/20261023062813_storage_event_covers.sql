-- Create the event-covers Storage bucket (public read, host-only write).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-covers',
  'event-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Path convention: event-covers/<event_id>/<filename>
create policy "Event cover images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'event-covers');

create policy "Hosts can upload covers for their own events"
  on storage.objects for insert
  with check (
    bucket_id = 'event-covers'
    and auth.uid() is not null
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name)) [1]
        and e.created_by = auth.uid()
    )
  );

create policy "Hosts can replace covers for their own events"
  on storage.objects for update
  using (
    bucket_id = 'event-covers'
    and auth.uid() is not null
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name)) [1]
        and e.created_by = auth.uid()
    )
  )
  with check (
    bucket_id = 'event-covers'
    and auth.uid() is not null
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name)) [1]
        and e.created_by = auth.uid()
    )
  );

create policy "Hosts can delete covers for their own events"
  on storage.objects for delete
  using (
    bucket_id = 'event-covers'
    and auth.uid() is not null
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name)) [1]
        and e.created_by = auth.uid()
    )
  );
