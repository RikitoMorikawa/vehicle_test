-- ユーザー
create table public.users (
  id uuid not null default gen_random_uuid (),
  company_name text not null,
  user_name text not null,
  phone text not null,
  email text not null,
  password text not null,
  role text not null default 'user'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  is_approved boolean null default false,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_role_check check (
    (
      role = any (
        array['admin'::text, 'user'::text, 'manager'::text]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists users_email_idx on public.users using btree (email) TABLESPACE pg_default;

create index IF not exists users_role_idx on public.users using btree (role) TABLESPACE pg_default;

create trigger set_admin_approved_trigger BEFORE INSERT
or
update on users for EACH row
execute FUNCTION set_admin_approved ();



-- 車両
create table public.vehicles (
  id uuid not null default gen_random_uuid (),
  name text not null,
  maker text not null,
  year integer not null,
  mileage integer not null,
  price integer not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  model_code text null,
  color text null,
  engine_size integer null,
  transmission text null,
  drive_system text null,
  inspection_date date null,
  vehicle_id text null,
  view360_images text[] null default '{}'::text[],
  vehicle_status character varying(10) null,
  full_model_code character varying(50) null,
  grade character varying(100) null,
  registration_number character varying(20) null,
  first_registration_date date null,
  chassis_number character varying(50) null,
  body_type character varying(50) null,
  door_count integer null,
  desired_number character varying(50) null,
  sales_format character varying(50) null,
  accident_history boolean null default false,
  recycling_deposit boolean null default false,
  registration_date date null,
  tax_rate integer null,
  images text[] null default array[]::text[],
  constraint vehicles_pkey primary key (id),
  constraint vehicles_door_count_check check (
    (
      (door_count >= 1)
      and (door_count <= 10)
    )
  ),
  constraint vehicles_tax_rate_check check ((tax_rate = any (array[8, 10])))
) TABLESPACE pg_default;

create index IF not exists vehicles_vehicle_id_idx on public.vehicles using btree (vehicle_id) TABLESPACE pg_default;

create index IF not exists idx_vehicles_images on public.vehicles using gin (images) TABLESPACE pg_default;



-- 車メーカー
create table public.car_makers (
  id serial not null,
  name text not null,
  logo_url text null,
  country text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint car_makers_pkey primary key (id),
  constraint car_makers_name_key unique (name)
) TABLESPACE pg_default;


-- 加盟店（企業）
create table public.companies (
  id uuid not null default gen_random_uuid (),
  name text not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  address text null,
  bank_account jsonb null,
  constraint companies_pkey primary key (id),
  constraint companies_name_key unique (name)
) TABLESPACE pg_default;

create trigger update_companies_updated_at BEFORE
update on companies for EACH row
execute FUNCTION update_updated_at_column ();



-- お気に入り
create table public.favorites (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  vehicle_id uuid not null,
  created_at timestamp with time zone null default now(),
  constraint favorites_pkey primary key (id),
  constraint favorites_user_id_vehicle_id_key unique (user_id, vehicle_id),
  constraint favorites_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint favorites_vehicle_id_fkey foreign KEY (vehicle_id) references vehicles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists favorites_user_id_idx on public.favorites using btree (user_id) TABLESPACE pg_default;

create index IF not exists favorites_vehicle_id_idx on public.favorites using btree (vehicle_id) TABLESPACE pg_default;



-- 運送費用
create table public.shipping_costs (
  id serial not null,
  area_code integer not null,
  prefecture character varying(10) not null,
  city character varying(50) not null,
  cost integer not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint shipping_costs_pkey primary key (id),
  constraint shipping_costs_area_code_key unique (area_code)
) TABLESPACE pg_default;

create index IF not exists idx_shipping_costs_area_code on public.shipping_costs using btree (area_code) TABLESPACE pg_default;

create index IF not exists idx_shipping_costs_city on public.shipping_costs using btree (city) TABLESPACE pg_default;

create index IF not exists idx_shipping_costs_prefecture on public.shipping_costs using btree (prefecture) TABLESPACE pg_default;

create trigger update_shipping_costs_updated_at BEFORE
update on shipping_costs for EACH row
execute FUNCTION update_updated_at_column ();


-- 注文
create table public.orders (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  vehicle_id uuid not null,
  status integer not null default 0,
  order_date timestamp with time zone not null default now(),
  approved_date timestamp with time zone null,
  rejected_date timestamp with time zone null,
  admin_user_id uuid null,
  reject_reason text null,
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint orders_pkey primary key (id),
  constraint fk_orders_admin_user foreign KEY (admin_user_id) references users (id) on delete set null,
  constraint fk_orders_user foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint fk_orders_vehicle foreign KEY (vehicle_id) references vehicles (id) on delete CASCADE,
  constraint orders_status_check check ((status = any (array[0, 1, 2, 3])))
) TABLESPACE pg_default;

create index IF not exists idx_orders_user_id on public.orders using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_orders_vehicle_id on public.orders using btree (vehicle_id) TABLESPACE pg_default;

create index IF not exists idx_orders_status on public.orders using btree (status) TABLESPACE pg_default;

create index IF not exists idx_orders_order_date on public.orders using btree (order_date) TABLESPACE pg_default;

create index IF not exists idx_orders_created_at on public.orders using btree (created_at) TABLESPACE pg_default;

create index IF not exists idx_orders_vehicle_user_status on public.orders using btree (vehicle_id, user_id, status) TABLESPACE pg_default;

create index IF not exists idx_orders_vehicle_status on public.orders using btree (vehicle_id, status) TABLESPACE pg_default;

create trigger orders_updated_at_trigger BEFORE
update on orders for EACH row
execute FUNCTION update_orders_updated_at ();


-- ローン審査
create table public.loan_applications (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  vehicle_id uuid not null,
  customer_name text not null,
  customer_name_kana text not null,
  customer_birth_date text not null,
  customer_postal_code text not null,
  customer_address text not null,
  customer_phone text null,
  customer_mobile_phone text not null,
  employer_name text not null,
  employer_postal_code text not null,
  employer_address text not null,
  employer_phone text not null,
  employment_type text not null,
  years_employed integer not null,
  annual_income integer not null,
  identification_doc_url text null,
  income_doc_url text null,
  vehicle_price integer not null,
  down_payment integer not null,
  payment_months integer not null,
  bonus_months text null,
  bonus_amount integer null,
  guarantor_name text null,
  guarantor_name_kana text null,
  guarantor_relationship text null,
  guarantor_phone text null,
  guarantor_postal_code text null,
  guarantor_address text null,
  notes text null,
  status integer not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  residence_type text null,
  residence_years integer null,
  marital_status text null,
  family_composition text null,
  dependents_count integer null default 0,
  constraint loan_applications_pkey primary key (id),
  constraint fk_loan_applications_vehicle foreign KEY (vehicle_id) references vehicles (id) on delete CASCADE,
  constraint fk_loan_applications_user foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint loan_applications_marital_status_check check (
    (
      marital_status = any (
        array[
          '未婚'::text,
          '既婚'::text,
          '离婚'::text,
          '死别'::text,
          'その他'::text
        ]
      )
    )
  ),
  constraint loan_applications_dependents_count_check check (
    (
      (dependents_count >= 0)
      and (dependents_count <= 20)
    )
  ),
  constraint loan_applications_residence_type_check check (
    (
      residence_type = any (
        array[
          '持ち家'::text,
          '賃貸マンション'::text,
          '賃貸アパート'::text,
          '社宅'::text,
          '公営住宅'::text,
          'その他'::text
        ]
      )
    )
  ),
  constraint loan_applications_residence_years_check check (
    (
      (residence_years >= 0)
      and (residence_years <= 100)
    )
  ),
  constraint loan_applications_status_check check (
    (
      (status >= 0)
      and (status <= 3)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_loan_applications_status on public.loan_applications using btree (status) TABLESPACE pg_default;

create index IF not exists idx_loan_applications_user_id on public.loan_applications using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_loan_applications_vehicle_id on public.loan_applications using btree (vehicle_id) TABLESPACE pg_default;

create index IF not exists idx_loan_applications_residence_type on public.loan_applications using btree (residence_type) TABLESPACE pg_default;

create index IF not exists idx_loan_applications_marital_status on public.loan_applications using btree (marital_status) TABLESPACE pg_default;

create index IF not exists idx_loan_applications_created_at on public.loan_applications using btree (created_at) TABLESPACE pg_default;

create trigger update_loan_applications_updated_at BEFORE
update on loan_applications for EACH row
execute FUNCTION update_updated_at_column ();


-- 書類用：車両
create table public.estimate_vehicles (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  maker character varying(100) not null,
  name character varying(200) not null,
  year integer not null,
  mileage integer not null,
  price integer not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  vehicle_id uuid null,
  company_id uuid null,
  document_type character varying(20) not null default 'estimate'::character varying,
  area_code integer null,
  constraint estimate_vehicles_pkey primary key (id),
  constraint estimate_vehicles_company_id_fkey foreign KEY (company_id) references companies (id),
  constraint estimate_vehicles_vehicle_id_fkey foreign KEY (vehicle_id) references vehicles (id) on delete CASCADE,
  constraint fk_estimate_vehicles_area_code foreign KEY (area_code) references shipping_costs (area_code),
  constraint fk_estimate_vehicles_user_id foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint estimate_vehicles_document_type_check check (
    (
      (document_type)::text = any (
        (
          array[
            'estimate'::character varying,
            'invoice'::character varying,
            'order'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_estimate_vehicles_company_id on public.estimate_vehicles using btree (company_id) TABLESPACE pg_default;

create index IF not exists idx_estimate_vehicles_document_type on public.estimate_vehicles using btree (document_type) TABLESPACE pg_default;

create index IF not exists idx_estimate_vehicles_area_code on public.estimate_vehicles using btree (area_code) TABLESPACE pg_default;

create index IF not exists idx_estimate_vehicles_user_id on public.estimate_vehicles using btree (user_id) TABLESPACE pg_default;

create trigger set_timestamp_estimate_vehicles BEFORE
update on estimate_vehicles for EACH row
execute FUNCTION update_modified_column ();


-- 書類用：法定費用
create table public.legal_fees (
  id uuid not null default gen_random_uuid (),
  inspection_registration_stamp integer not null default 0,
  parking_certificate_stamp integer not null default 0,
  trade_in_stamp integer not null default 0,
  recycling_deposit integer not null default 0,
  other_nontaxable integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  estimate_id uuid null,
  constraint legal_fees_pkey primary key (id),
  constraint legal_fees_estimate_id_fkey foreign KEY (estimate_id) references estimate_vehicles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists legal_fees_estimate_id_idx on public.legal_fees using btree (estimate_id) TABLESPACE pg_default;

create trigger update_legal_fees_updated_at BEFORE
update on legal_fees for EACH row
execute FUNCTION update_updated_at_column ();



-- 書類用：ローン計算
create table public.loan_calculations (
  id uuid not null default gen_random_uuid (),
  down_payment integer not null default 0,
  principal integer not null default 0,
  interest_fee integer not null default 0,
  total_payment integer not null default 0,
  payment_count integer not null,
  payment_period integer not null,
  first_payment integer not null default 0,
  monthly_payment integer not null default 0,
  bonus_months text[] null default '{}'::text[],
  bonus_amount integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  estimate_id uuid null,
  vehicle_id uuid null,
  annual_rate numeric(5, 2) not null default 0.00,
  constraint loan_calculations_pkey primary key (id),
  constraint loan_calculations_estimate_id_fkey foreign KEY (estimate_id) references estimate_vehicles (id) on delete CASCADE,
  constraint loan_calculations_annual_rate_check check (
    (
      (annual_rate >= 0.00)
      and (annual_rate <= 50.00)
    )
  ),
  constraint loan_calculations_payment_count_check check ((payment_count > 0)),
  constraint loan_calculations_payment_period_check check ((payment_period > 0))
) TABLESPACE pg_default;

create index IF not exists idx_loan_calculations_payment_period on public.loan_calculations using btree (payment_period) TABLESPACE pg_default;

create index IF not exists idx_loan_calculations_annual_rate on public.loan_calculations using btree (annual_rate) TABLESPACE pg_default;

create trigger update_loan_calculations_updated_at BEFORE
update on loan_calculations for EACH row
execute FUNCTION update_updated_at_column ();



-- 書類用：手続き手数料
create table public.processing_fees (
  id uuid not null default gen_random_uuid (),
  inspection_registration_fee integer not null default 0,
  parking_certificate_fee integer not null default 0,
  trade_in_processing_fee integer not null default 0,
  trade_in_assessment_fee integer not null default 0,
  recycling_management_fee integer not null default 0,
  delivery_fee integer not null default 0,
  other_fees integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  estimate_id uuid null,
  constraint processing_fees_pkey primary key (id),
  constraint processing_fees_estimate_id_fkey foreign KEY (estimate_id) references estimate_vehicles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists processing_fees_estimate_id_idx on public.processing_fees using btree (estimate_id) TABLESPACE pg_default;

create trigger update_processing_fees_updated_at BEFORE
update on processing_fees for EACH row
execute FUNCTION update_updated_at_column ();



-- 書類用：販売価格
create table public.sales_prices (
  id uuid not null default gen_random_uuid (),
  vehicle_id uuid null,
  base_price integer not null default 0,
  discount integer not null default 0,
  inspection_fee integer not null default 0,
  accessories_fee integer not null default 0,
  vehicle_price integer not null default 0,
  tax_insurance integer not null default 0,
  legal_fee integer not null default 0,
  processing_fee integer not null default 0,
  misc_fee integer not null default 0,
  consumption_tax integer not null default 0,
  total_price integer not null default 0,
  trade_in_price integer not null default 0,
  trade_in_debt integer not null default 0,
  payment_total integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  estimate_id uuid null,
  constraint sales_prices_pkey primary key (id),
  constraint sales_prices_estimate_id_fkey foreign KEY (estimate_id) references estimate_vehicles (id) on delete CASCADE,
  constraint sales_prices_vehicle_id_fkey foreign KEY (vehicle_id) references vehicles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_sales_prices_vehicle_id on public.sales_prices using btree (vehicle_id) TABLESPACE pg_default;

create index IF not exists sales_prices_estimate_id_idx on public.sales_prices using btree (estimate_id) TABLESPACE pg_default;

create trigger update_sales_prices_updated_at BEFORE
update on sales_prices for EACH row
execute FUNCTION update_updated_at_column ();



-- 書類用：税金・保険料
create table public.tax_insurance_fees (
  id uuid not null default gen_random_uuid (),
  automobile_tax integer not null default 0,
  environmental_performance_tax integer not null default 0,
  weight_tax integer not null default 0,
  liability_insurance_fee integer not null default 0,
  voluntary_insurance_fee integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  estimate_id uuid null,
  constraint tax_insurance_fees_pkey primary key (id),
  constraint tax_insurance_fees_estimate_id_fkey foreign KEY (estimate_id) references estimate_vehicles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists tax_insurance_fees_estimate_id_idx on public.tax_insurance_fees using btree (estimate_id) TABLESPACE pg_default;

create trigger update_tax_insurance_fees_updated_at BEFORE
update on tax_insurance_fees for EACH row
execute FUNCTION update_updated_at_column ();



-- 書類用：下取り車両
create table public.trade_in_vehicles (
  id uuid not null default gen_random_uuid (),
  vehicle_name text not null,
  registration_number text not null,
  mileage integer not null,
  first_registration_date date null,
  inspection_expiry_date date null,
  chassis_number text null,
  exterior_color text not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  estimate_id uuid null,
  trade_in_available boolean not null default false,
  constraint trade_in_vehicles_pkey primary key (id),
  constraint trade_in_vehicles_estimate_id_fkey foreign KEY (estimate_id) references estimate_vehicles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_trade_in_vehicles_chassis_number on public.trade_in_vehicles using btree (chassis_number) TABLESPACE pg_default;

create index IF not exists idx_trade_in_vehicles_registration_number on public.trade_in_vehicles using btree (registration_number) TABLESPACE pg_default;

create trigger update_trade_in_vehicles_updated_at BEFORE
update on trade_in_vehicles for EACH row
execute FUNCTION update_updated_at_column ();



-- 書類用：装備品
create table public.accessories (
  id uuid not null default gen_random_uuid (),
  name text not null,
  price integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  estimate_id uuid null,
  constraint accessories_pkey primary key (id),
  constraint accessories_estimate_id_fkey foreign KEY (estimate_id) references estimate_vehicles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists accessories_estimate_id_idx on public.accessories using btree (estimate_id) TABLESPACE pg_default;

create trigger update_accessories_updated_at BEFORE
update on accessories for EACH row
execute FUNCTION update_updated_at_column ();
