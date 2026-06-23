alter table load_balancers
add column updated_at timestamp not null default now();

alter table jobs
add column updated_at timestamp not null default now();
