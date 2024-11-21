insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data,
                        email_confirmed_at, created_at, updated_at, confirmation_token, recovery_token,
                        email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '185f2f83-d63a-4c9b-b4a0-7e4a885799e2', 'authenticated',
        'authenticated', 'trader@email.com', '$2a$10$h2MfkFrYKMQAV83HhAZfMOdFq3BG9Q4B8mvs.kXFpbTNi2VANZxJ.',
        '{"provider":"email","providers":["email"]}', '{}',
        timezone('utc'::text, now()), timezone('utc'::text, now()), timezone('utc'::text, now()), '', '', '', '');

insert into public.user_roles (user_id, role)
values ('185f2f83-d63a-4c9b-b4a0-7e4a885799e2', 'trader');

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data,
                        email_confirmed_at, created_at, updated_at, confirmation_token, recovery_token,
                        email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', 'aabc22aa-68ba-425c-9888-d5e77ad1f30e', 'authenticated',
        'authenticated', 'customer@email.com', '$2a$10$h2MfkFrYKMQAV83HhAZfMOdFq3BG9Q4B8mvs.kXFpbTNi2VANZxJ.',
        '{"provider":"email","providers":["email"]}', '{}',
        timezone('utc'::text, now()), timezone('utc'::text, now()), timezone('utc'::text, now()), '', '', '', '');

insert into public.user_roles (user_id, role)
values ('aabc22aa-68ba-425c-9888-d5e77ad1f30e', 'customer');

