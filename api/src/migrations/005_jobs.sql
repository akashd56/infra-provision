alter table jobs alter column type type text using type::text;

alter table jobs alter column status type text using status::text;

alter table jobs alter column status drop default;

drop type job_type;
drop type job_status;

alter table load_balancers alter column status type text using status::text;

drop type lb_status;
