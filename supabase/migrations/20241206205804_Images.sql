create table "public"."images" (
                                   "id" uuid not null,
                                   "category_id" integer not null default 0,
                                   "title" text not null,
                                   "description" text,
                                   "image_height" double precision,
                                   "image_width" double precision,
                                   "paper_height" double precision,
                                   "paper_width" double precision,
                                   "annotations" text
);


CREATE UNIQUE INDEX imges_pk ON public.images USING btree (id);

alter table "public"."images" add constraint "imges_pk" PRIMARY KEY using index "imges_pk";

grant delete on table "public"."images" to "anon";

grant insert on table "public"."images" to "anon";

grant references on table "public"."images" to "anon";

grant select on table "public"."images" to "anon";

grant trigger on table "public"."images" to "anon";

grant truncate on table "public"."images" to "anon";

grant update on table "public"."images" to "anon";

grant delete on table "public"."images" to "authenticated";

grant insert on table "public"."images" to "authenticated";

grant references on table "public"."images" to "authenticated";

grant select on table "public"."images" to "authenticated";

grant trigger on table "public"."images" to "authenticated";

grant truncate on table "public"."images" to "authenticated";

grant update on table "public"."images" to "authenticated";

grant delete on table "public"."images" to "service_role";

grant insert on table "public"."images" to "service_role";

grant references on table "public"."images" to "service_role";

grant select on table "public"."images" to "service_role";

grant trigger on table "public"."images" to "service_role";

grant truncate on table "public"."images" to "service_role";

grant update on table "public"."images" to "service_role";
