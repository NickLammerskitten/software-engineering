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

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 3', 'Description 3', 800, 600, 800, 600, 'Annotation 3', 150.00, 'Künstler 3');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 4', 'Description 4', 500, 500, 520, 520, 'Annotation 4', 250.50, 'Künstler 4');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 5', 'Description 5', 1200, 800, 1200, 800, 'Annotation 5', 350.00, 'Künstler 5');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 6', 'Description 6', 300, 400, 310, 410, 'Annotation 6', 85.00, 'Künstler 6');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (1, 'Image 7', 'Description 7', 700, 700, 710, 710, 'Annotation 7', 95.75, 'Künstler 7');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (1, 'Image 8', 'Description 8', 1500, 1500, 1500, 1500, 'Annotation 8', 500.00, 'Künstler 8');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 9', 'Description 9', 400, 600, 400, 600, 'Annotation 9', 125.00, 'Künstler 9');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 10', 'Description 10', 600, 800, 620, 820, 'Annotation 10', 200.00, 'Künstler 10');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (1, 'Image 11', 'Description 11', 900, 1200, 900, 1200, 'Annotation 11', 175.50, 'Künstler 11');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (1, 'Image 12', 'Description 12', 1100, 1300, 1110, 1310, 'Annotation 12', 600.00, 'Künstler 12');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 13', 'Description 13', 300, 200, 310, 210, 'Annotation 13', 65.00, 'Künstler 13');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 14', 'Description 14', 700, 500, 720, 520, 'Annotation 14', 175.00, 'Künstler 14');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 15', 'Description 15', 800, 1000, 800, 1000, 'Annotation 15', 400.00, 'Künstler 15');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (2, 'Image 16', 'Description 16', 1000, 800, 1020, 820, 'Annotation 16', 320.00, 'Künstler 16');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (1, 'Image 17', 'Description 17', 500, 400, 500, 400, 'Annotation 17', 150.00, 'Künstler 17');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (1, 'Image 18', 'Description 18', 600, 600, 610, 610, 'Annotation 18', 275.00, 'Künstler 18');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (1, 'Image 19', 'Description 19', 750, 900, 750, 900, 'Annotation 19', 350.00, 'Künstler 19');

insert into public.image(category_id, title, description, image_height, image_width, paper_height, paper_width,
                         annotations, price, artist)
values (1, 'Image 20', 'Description 20', 900, 1100, 920, 1120, 'Annotation 20', 490.00, 'Künstler 20');

insert into storage.buckets (id, name, public, avif_autodetection)
values ('images', 'images', true, true);

INSERT INTO "public"."palette" ("id", "name")
VALUES ('45d09dba-6512-4433-8b4d-da367384d77d', 'Alu 20mm'),
       ('9491ddd2-f5b2-40cc-8024-4313a6ca2d5c', 'Alu 30mm');

INSERT INTO "public"."strip_color" ("id", "name")
VALUES ('77b9eb8b-a842-41c0-95af-20e8f5f4e50f', 'Silber'),
       ('9760c87d-34ff-4793-bb92-1b49f2915fa8', 'Rot'),
       ('cd2dbe14-63b1-4ec4-90a5-7a296928224b', 'Gold'),
       ('e61f3696-8f34-4d07-abda-5689e92cd563', 'Schwarz');

INSERT INTO "public".portfolio (id, name, description, owner_id)
VALUES ('5b72a802-54b1-4393-b205-ccf2937c073b', 'Trader Portfolio', 'Portfolio eines Traders', '185f2f83-d63a-4c9b-b4a0-7e4a885799e2'),
        ('f3b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b', 'Customer Portfolio', 'Portfolio eines Kunden', 'aabc22aa-68ba-425c-9888-d5e77ad1f30e');

INSERT INTO "public"."image_configuration" ("id", "image_id", "portfolio_id", "by_trader", "palette_id",
                                            "strip_color_id", "passepartout")
VALUES ('043598d5-1da9-4b1e-83ba-96a3af0e51fa', '0b29d9c7-ae71-440a-a631-e67b0875cd51',
        '5b72a802-54b1-4393-b205-ccf2937c073b', 'true', '45d09dba-6512-4433-8b4d-da367384d77d',
        '77b9eb8b-a842-41c0-95af-20e8f5f4e50f', 'true'),
       ('80dd5a70-e3e0-4ff9-97a5-9eecba9c44f1', '0b29d9c7-ae71-440a-a631-e67b0875cd51',
        'f3b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b', 'true', '9491ddd2-f5b2-40cc-8024-4313a6ca2d5c',
        '9760c87d-34ff-4793-bb92-1b49f2915fa8', 'false');