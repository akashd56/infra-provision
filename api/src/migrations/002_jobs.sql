create type job_status as enum (
  'PENDING',
  'PROCESSING',
  'DONE',
  'FAILED'
);

create type job_type as enum (
    'PROVISION_LB'
);

create table jobs (
  id uuid primary key,
  type job_type not null,
  payload jsonb not null,
  status job_status not null default 'PENDING',
  created_at timestamp not null default now()
);
