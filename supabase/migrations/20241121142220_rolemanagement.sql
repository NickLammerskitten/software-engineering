create type public.app_role as enum ('trader', 'customer');

create table public.user_roles (
                                   id        bigint generated by default as identity primary key,
                                   user_id   uuid references auth.users on delete cascade not null,
                                   role      app_role not null,
                                   unique (user_id, role)
);
comment on table public.user_roles is 'Application roles for each user.';