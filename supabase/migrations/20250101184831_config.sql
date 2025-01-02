create table "public"."palette" (
                                    "id" uuid not null default gen_random_uuid(),
                                    "name" text not null
);


create table "public"."strip" (
                                        "id" uuid not null default gen_random_uuid(),
                                        "name" text not null
);


alter table "public"."image_configuration" add column "palette_id" uuid;

alter table "public"."image_configuration" add column "passepartout" boolean not null default false;

alter table "public"."image_configuration" add column "strip_id" uuid;

CREATE UNIQUE INDEX palette_pk ON public.palette USING btree (id);

CREATE UNIQUE INDEX strip_pk ON public.strip
USING btree (id);

alter table "public"."palette" add constraint "palette_pk" PRIMARY KEY using index "palette_pk";

alter table "public"."strip" add constraint "strip_pk" PRIMARY KEY using index "strip_pk";

alter table "public"."image_configuration" add constraint "image_configuration_palette_id_fk" FOREIGN KEY (palette_id) REFERENCES palette(id) not valid;

alter table "public"."image_configuration" validate constraint "image_configuration_palette_id_fk";

alter table "public"."image_configuration" add constraint "image_configuration_strip_id_fk" FOREIGN KEY (strip_id) REFERENCES strip
(id) not valid;

alter table "public"."image_configuration" validate constraint "image_configuration_strip_id_fk";

grant delete on table "public"."palette" to "anon";

grant insert on table "public"."palette" to "anon";

grant references on table "public"."palette" to "anon";

grant select on table "public"."palette" to "anon";

grant trigger on table "public"."palette" to "anon";

grant truncate on table "public"."palette" to "anon";

grant update on table "public"."palette" to "anon";

grant delete on table "public"."palette" to "authenticated";

grant insert on table "public"."palette" to "authenticated";

grant references on table "public"."palette" to "authenticated";

grant select on table "public"."palette" to "authenticated";

grant trigger on table "public"."palette" to "authenticated";

grant truncate on table "public"."palette" to "authenticated";

grant update on table "public"."palette" to "authenticated";

grant delete on table "public"."palette" to "service_role";

grant insert on table "public"."palette" to "service_role";

grant references on table "public"."palette" to "service_role";

grant select on table "public"."palette" to "service_role";

grant trigger on table "public"."palette" to "service_role";

grant truncate on table "public"."palette" to "service_role";

grant update on table "public"."palette" to "service_role";

grant delete on table "public"."strip" to "anon";

grant insert on table "public"."strip" to "anon";

grant references on table "public"."strip" to "anon";

grant select on table "public"."strip" to "anon";

grant trigger on table "public"."strip" to "anon";

grant truncate on table "public"."strip" to "anon";

grant update on table "public"."strip" to "anon";

grant delete on table "public"."strip" to "authenticated";

grant insert on table "public"."strip" to "authenticated";

grant references on table "public"."strip" to "authenticated";

grant select on table "public"."strip" to "authenticated";

grant trigger on table "public"."strip" to "authenticated";

grant truncate on table "public"."strip" to "authenticated";

grant update on table "public"."strip" to "authenticated";

grant delete on table "public"."strip" to "service_role";

grant insert on table "public"."strip" to "service_role";

grant references on table "public"."strip" to "service_role";

grant select on table "public"."strip" to "service_role";

grant trigger on table "public"."strip" to "service_role";

grant truncate on table "public"."strip" to "service_role";

grant update on table "public"."strip" to "service_role";

alter table "public"."palette" enable row level security;

create policy "Allow all to trader"
    on "public"."palette"
    as permissive
    for all
    to trader
    using (true);


create policy "Enable read access for all authenticated users"
    on "public"."palette"
    as permissive
    for select
    to authenticated
    using (true);

alter table "public"."strip" enable row level security;

create policy "Allow all to trader"
    on "public"."strip"
    as permissive
    for all
    to trader
    using (true);


create policy "Enable read access for all authenticated users"
    on "public"."strip"
    as permissive
    for select
    to authenticated
    using (true);
