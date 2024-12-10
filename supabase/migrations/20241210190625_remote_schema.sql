drop policy "Enable delete for trader only" on "public"."image";

drop policy "Enable insert for trader only" on "public"."image";

drop policy "Enable read access for all authenticated users" on "public"."image";

drop policy "Enable update for trader only" on "public"."image";

revoke delete on table "public"."image" from "anon";

revoke insert on table "public"."image" from "anon";

revoke references on table "public"."image" from "anon";

revoke select on table "public"."image" from "anon";

revoke trigger on table "public"."image" from "anon";

revoke truncate on table "public"."image" from "anon";

revoke update on table "public"."image" from "anon";

revoke delete on table "public"."image" from "authenticated";

revoke insert on table "public"."image" from "authenticated";

revoke references on table "public"."image" from "authenticated";

revoke select on table "public"."image" from "authenticated";

revoke trigger on table "public"."image" from "authenticated";

revoke truncate on table "public"."image" from "authenticated";

revoke update on table "public"."image" from "authenticated";

revoke delete on table "public"."image" from "service_role";

revoke insert on table "public"."image" from "service_role";

revoke references on table "public"."image" from "service_role";

revoke select on table "public"."image" from "service_role";

revoke trigger on table "public"."image" from "service_role";

revoke truncate on table "public"."image" from "service_role";

revoke update on table "public"."image" from "service_role";

alter table "public"."image" drop constraint "imges_pk";

drop index if exists "public"."imges_pk";

drop table "public"."image";


