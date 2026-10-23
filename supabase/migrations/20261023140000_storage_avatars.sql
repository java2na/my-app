-- Create the avatars Storage bucket (public read, owner-only write).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Path convention: avatars/<user_id>/<filename>
create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name)) [1] = auth.uid()::text
  );

create policy "Users can replace their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name)) [1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name)) [1] = auth.uid()::text
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name)) [1] = auth.uid()::text
  );
