create table "public"."image" (
                                   "id" uuid not null default uuid_generate_v4(),
                                   "category_id" integer not null default 0,
                                   "title" text not null,
                                   "description" text,
                                   "image_height" double precision,
                                   "image_width" double precision,
                                   "paper_height" double precision,
                                   "paper_width" double precision,
                                   "annotations" text,
                                   "price" float not null default 0
);


CREATE UNIQUE INDEX imges_pk ON public.image
USING btree (id);

alter table "public"."image" add constraint "imges_pk" PRIMARY KEY using index "imges_pk";

grant delete on table "public"."image" to "anon";

grant insert on table "public"."image" to "anon";

grant references on table "public"."image" to "anon";

grant select on table "public"."image" to "anon";

grant trigger on table "public"."image" to "anon";

grant truncate on table "public"."image" to "anon";

grant update on table "public"."image" to "anon";

grant delete on table "public"."image" to "authenticated";

grant insert on table "public"."image" to "authenticated";

grant references on table "public"."image" to "authenticated";

grant select on table "public"."image" to "authenticated";

grant trigger on table "public"."image" to "authenticated";

grant truncate on table "public"."image" to "authenticated";

grant update on table "public"."image" to "authenticated";

grant delete on table "public"."image" to "service_role";

grant insert on table "public"."image" to "service_role";

grant references on table "public"."image" to "service_role";

grant select on table "public"."image" to "service_role";

grant trigger on table "public"."image" to "service_role";

grant truncate on table "public"."image" to "service_role";

grant update on table "public"."image" to "service_role";


alter table "public"."image" enable row level security;

create policy "Enable delete for trader only"
    on "public"."image"
    as permissive
    for delete
    to trader
    using (true);


create policy "Enable insert for trader only"
    on "public"."image"
    as permissive
    for insert
    to trader
    with check (true);


create policy "Enable read access for all authenticated users"
    on "public"."image"
    as permissive
    for select
    to authenticated
    using (true);


create policy "Enable update for trader only"
    on "public"."image"
    as permissive
    for update
    to trader
    using (true)
    with check (true);

