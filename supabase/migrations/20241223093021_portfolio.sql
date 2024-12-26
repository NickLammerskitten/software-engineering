create table "public"."image_configuration" (
                                                "id" uuid not null default gen_random_uuid(),
                                                "image_id" uuid not null,
                                                "portfolio_id" uuid not null,
                                                "by_trader" boolean not null
);


alter table "public"."image_configuration" enable row level security;

create table "public"."portfolio" (
                                      "id" uuid not null default uuid_generate_v4(),
                                      "name" text not null,
                                      "description" text,
                                      "owner_id" uuid not null
);


alter table "public"."portfolio" enable row level security;

CREATE UNIQUE INDEX image_configuration_pk ON public.image_configuration USING btree (id);

CREATE UNIQUE INDEX portfolio_pk ON public.portfolio USING btree (id);

alter table "public"."image_configuration" add constraint "image_configuration_pk" PRIMARY KEY using index "image_configuration_pk";

alter table "public"."portfolio" add constraint "portfolio_pk" PRIMARY KEY using index "portfolio_pk";

alter table "public"."image_configuration" add constraint "image_configuration_image_id_fk" FOREIGN KEY (image_id) REFERENCES image(id) not valid;

alter table "public"."image_configuration" validate constraint "image_configuration_image_id_fk";

alter table "public"."image_configuration" add constraint "image_configuration_portfolio_id_fk" FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) not valid;

alter table "public"."image_configuration" validate constraint "image_configuration_portfolio_id_fk";

alter table "public"."portfolio" add constraint "portfolio_users_id_fk" FOREIGN KEY (owner_id) REFERENCES auth.users(id) not valid;

alter table "public"."portfolio" validate constraint "portfolio_users_id_fk";

alter table "public"."image_configuration" drop constraint "image_configuration_image_id_fk";

alter table "public"."image_configuration" drop constraint "image_configuration_portfolio_id_fk";

alter table "public"."image_configuration" add constraint "image_configuration_image_id_fkey" FOREIGN KEY (image_id) REFERENCES image(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."image_configuration" validate constraint "image_configuration_image_id_fkey";

alter table "public"."image_configuration" add constraint "image_configuration_portfolio_id_fkey" FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."image_configuration" validate constraint "image_configuration_portfolio_id_fkey";

grant delete on table "public"."image_configuration" to "anon";

grant insert on table "public"."image_configuration" to "anon";

grant references on table "public"."image_configuration" to "anon";

grant select on table "public"."image_configuration" to "anon";

grant trigger on table "public"."image_configuration" to "anon";

grant truncate on table "public"."image_configuration" to "anon";

grant update on table "public"."image_configuration" to "anon";

grant delete on table "public"."image_configuration" to "authenticated";

grant insert on table "public"."image_configuration" to "authenticated";

grant references on table "public"."image_configuration" to "authenticated";

grant select on table "public"."image_configuration" to "authenticated";

grant trigger on table "public"."image_configuration" to "authenticated";

grant truncate on table "public"."image_configuration" to "authenticated";

grant update on table "public"."image_configuration" to "authenticated";

grant delete on table "public"."image_configuration" to "service_role";

grant insert on table "public"."image_configuration" to "service_role";

grant references on table "public"."image_configuration" to "service_role";

grant select on table "public"."image_configuration" to "service_role";

grant trigger on table "public"."image_configuration" to "service_role";

grant truncate on table "public"."image_configuration" to "service_role";

grant update on table "public"."image_configuration" to "service_role";

grant delete on table "public"."portfolio" to "anon";

grant insert on table "public"."portfolio" to "anon";

grant references on table "public"."portfolio" to "anon";

grant select on table "public"."portfolio" to "anon";

grant trigger on table "public"."portfolio" to "anon";

grant truncate on table "public"."portfolio" to "anon";

grant update on table "public"."portfolio" to "anon";

grant delete on table "public"."portfolio" to "authenticated";

grant insert on table "public"."portfolio" to "authenticated";

grant references on table "public"."portfolio" to "authenticated";

grant select on table "public"."portfolio" to "authenticated";

grant trigger on table "public"."portfolio" to "authenticated";

grant truncate on table "public"."portfolio" to "authenticated";

grant update on table "public"."portfolio" to "authenticated";

grant delete on table "public"."portfolio" to "service_role";

grant insert on table "public"."portfolio" to "service_role";

grant references on table "public"."portfolio" to "service_role";

grant select on table "public"."portfolio" to "service_role";

grant trigger on table "public"."portfolio" to "service_role";

grant truncate on table "public"."portfolio" to "service_role";

grant update on table "public"."portfolio" to "service_role";

create policy "Enable access for trader"
    on "public"."portfolio"
    as permissive
    for all
    to trader
    using (true);


create policy "Enable delete for users based on user_id"
    on "public"."portfolio"
    as permissive
    for delete
    to authenticated
    using ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Enable insert for users based on user_id"
    on "public"."portfolio"
    as permissive
    for insert
    to authenticated
    with check ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Enable update for users based on user_id"
    on "public"."portfolio"
    as permissive
    for update
    to authenticated
    using ((( SELECT auth.uid() AS uid) = owner_id))
    with check ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Enable users to view their own data only"
    on "public"."portfolio"
    as permissive
    for select
    to authenticated
    using ((( SELECT auth.uid() AS uid) = owner_id));



create policy "Enable access for trader"
    on "public"."image_configuration"
    as permissive
    for all
    to trader
    using (true);


create policy "Enable delete for users based on user_id"
    on "public"."image_configuration"
    as permissive
    for delete
    to authenticated
    using ((( SELECT auth.uid() AS uid) IN ( SELECT portfolio.owner_id
                                             FROM portfolio
                                             WHERE (image_configuration.portfolio_id = portfolio.id))));


create policy "Enable insert for users based on user_id"
    on "public"."image_configuration"
    as permissive
    for insert
    to authenticated
    with check ((( SELECT auth.uid() AS uid) IN ( SELECT portfolio.owner_id
                                                  FROM portfolio
                                                  WHERE (image_configuration.portfolio_id = portfolio.id))));


create policy "Enable update for users based on user_id"
    on "public"."image_configuration"
    as permissive
    for update
    to authenticated
    using ((( SELECT auth.uid() AS uid) IN ( SELECT portfolio.owner_id
                                             FROM portfolio
                                             WHERE (image_configuration.portfolio_id = portfolio.id))));


create policy "Enable users to view their own data only"
    on "public"."image_configuration"
    as permissive
    for select
    to authenticated
    using ((( SELECT auth.uid() AS uid) IN ( SELECT portfolio.owner_id
                                             FROM portfolio
                                             WHERE (image_configuration.portfolio_id = portfolio.id))));
