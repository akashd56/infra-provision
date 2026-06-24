create table load_balancers (
    id uuid primary key,
    name text not null,
    status text not null,
    container_id text,
    image text not null default 'nginx:latest',
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table jobs (
    id uuid primary key,
    type text not null,
    payload jsonb not null,
    status text not null,
    attempts integer not null default 0,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);
