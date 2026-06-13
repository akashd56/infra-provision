create type lb_status as enum (
    'PROVISIONING',
    'PROVISIONED',
    'FAILED'
);

create table load_balancers (
    id uuid primary key,
    name text not null,
    status lb_status not null,
    created_at timestamp not null default now()
);
