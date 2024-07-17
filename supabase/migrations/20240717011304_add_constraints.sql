alter table public.plans add
    constraint plans_meal_plan_fkey foreign key (meal_plan) references meal_plans (id) on update cascade on delete cascade;
alter table public.plans add
    constraint plans_recipes_fkey foreign key (recipes) references recipe_plans (id) on update cascade on delete cascade;
-- ) tablespace pg_default;