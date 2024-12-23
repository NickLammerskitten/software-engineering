insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data,
                        email_confirmed_at, created_at, updated_at, confirmation_token, recovery_token,
                        email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '185f2f83-d63a-4c9b-b4a0-7e4a885799e2', 'authenticated',
        'trader', 'trader@email.com', '$2a$10$h2MfkFrYKMQAV83HhAZfMOdFq3BG9Q4B8mvs.kXFpbTNi2VANZxJ.',
        '{
          "provider": "email",
          "providers": [
            "email"
          ]
        }', '{}',
        timezone('utc'::text, now()), timezone('utc'::text, now()), timezone('utc'::text, now()), '', '', '', '');

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data,
                        email_confirmed_at, created_at, updated_at, confirmation_token, recovery_token,
                        email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', 'aabc22aa-68ba-425c-9888-d5e77ad1f30e', 'authenticated',
        'authenticated', 'customer@email.com', '$2a$10$h2MfkFrYKMQAV83HhAZfMOdFq3BG9Q4B8mvs.kXFpbTNi2VANZxJ.',
        '{
          "provider": "email",
          "providers": [
            "email"
          ]
        }', '{}',
        timezone('utc'::text, now()), timezone('utc'::text, now()), timezone('utc'::text, now()), '', '', '', '');

insert into public.category (name)
values ('Original');

insert into public.category (name)
values ('Kopie');

insert into public.image(id, category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values ('0b29d9c7-ae71-440a-a631-e67b0875cd51', 1, 'Image 1', 'Image 1 description', 1000, 1000, 1000, 1000, 'Annotation', 100.00, 'Künstler 1');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 2', 'Image 2 description', 100, 100, 120, 120, 'Annotation 2', 999.95, 'Künstler 2');



insert into storage.buckets (id, name, public, avif_autodetection)
values
('images', 'images', true, true);


insert into public.portfolio(id, name, description, owner_id)
values ('5b72a802-54b1-4393-b205-ccf2937c073b','Portfolio 1', 'Portfolio 1 description', '185f2f83-d63a-4c9b-b4a0-7e4a885799e2');

insert into public.image_configuration (image_id, portfolio_id, by_trader)
values ('0b29d9c7-ae71-440a-a631-e67b0875cd51', '5b72a802-54b1-4393-b205-ccf2937c073b', true);