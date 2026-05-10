CREATE TABLE public."User" (
    rollno character varying(10) NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    image_url text,
    password character varying(255) NOT NULL,
    "campusID" integer NOT NULL,
    account_type character varying(10) DEFAULT 'public'::character varying NOT NULL,
    CONSTRAINT "User_account_type_check" CHECK (((account_type)::text = ANY ((ARRAY['public'::character varying, 'private'::character varying])::text[]))),
    CONSTRAINT chk_user_email_format CHECK (((email)::text ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'::text)),
    CONSTRAINT pk_user_rollno CHECK (((rollno)::text ~ '^[0-9]{2}[A-Z]-[0-9]{4}$'::text))
);

CREATE TABLE public.campus (
    "campusID" integer NOT NULL,
    "campusName" character varying(20)
);

CREATE TABLE public.category (
    category_id integer NOT NULL,
    category character varying(50) NOT NULL
);

CREATE TABLE public.foundpostcomment (
    f_comment_id integer NOT NULL,
    f_post_id integer,
    comment text,
    rollno character varying(10),
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.foundpost (
    f_post_id integer NOT NULL,
    rollno character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    item_id integer,
    is_verified boolean DEFAULT false NOT NULL,
    "campusID" integer DEFAULT 1 NOT NULL
);

CREATE TABLE public.item (
    item_id integer NOT NULL,
    category_id integer,
    image_url text,
    description text,
    title character varying(30),
    location text
);

CREATE TABLE public.lostpost (
    lpost_id integer NOT NULL,
    rollno character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    item_id integer,
    is_verified boolean DEFAULT false NOT NULL,
    "campusID" integer DEFAULT 1 NOT NULL
);

CREATE TABLE public.lostpostcomment (
    l_comment_id integer NOT NULL,
    l_post_id integer,
    comment text,
    rollno character varying(10),
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.notification (
    id integer NOT NULL,
    sender text,
    receiver text
);

CREATE TABLE public.otp (
    otp_id integer NOT NULL,
    email character varying(30) NOT NULL,
    otp character varying(6) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp without time zone DEFAULT (CURRENT_TIMESTAMP + '00:05:00'::interval),
    is_verified boolean DEFAULT false NOT NULL
);

CREATE TABLE public.verified_users (
    rollno character varying(10) NOT NULL
);

-- Sequences for auto-incrementing IDs
CREATE SEQUENCE public.category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.foundpost_f_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.foundpostcomment_f_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.item_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.lostpost_lpost_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.lostpostcomment_l_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.otp_otp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Set default values for auto-increment columns
ALTER TABLE ONLY public.category ALTER COLUMN category_id SET DEFAULT nextval('public.category_category_id_seq'::regclass);
ALTER TABLE ONLY public.foundpost ALTER COLUMN f_post_id SET DEFAULT nextval('public.foundpost_f_post_id_seq'::regclass);
ALTER TABLE ONLY public.foundpostcomment ALTER COLUMN f_comment_id SET DEFAULT nextval('public.foundpostcomment_f_comment_id_seq'::regclass);
ALTER TABLE ONLY public.item ALTER COLUMN item_id SET DEFAULT nextval('public.item_item_id_seq'::regclass);
ALTER TABLE ONLY public.lostpost ALTER COLUMN lpost_id SET DEFAULT nextval('public.lostpost_lpost_id_seq'::regclass);
ALTER TABLE ONLY public.lostpostcomment ALTER COLUMN l_comment_id SET DEFAULT nextval('public.lostpostcomment_l_comment_id_seq'::regclass);
ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);
ALTER TABLE ONLY public.otp ALTER COLUMN otp_id SET DEFAULT nextval('public.otp_otp_id_seq'::regclass);

-- Primary Keys
ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (rollno);

ALTER TABLE ONLY public.campus
    ADD CONSTRAINT campus_pkey PRIMARY KEY ("campusID");

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);

ALTER TABLE ONLY public.foundpost
    ADD CONSTRAINT foundpost_pkey PRIMARY KEY (f_post_id);

ALTER TABLE ONLY public.foundpostcomment
    ADD CONSTRAINT foundpostcomment_pkey PRIMARY KEY (f_comment_id);

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (item_id);

ALTER TABLE ONLY public.lostpost
    ADD CONSTRAINT lostpost_pkey PRIMARY KEY (lpost_id);

ALTER TABLE ONLY public.lostpostcomment
    ADD CONSTRAINT lostpostcomment_pkey PRIMARY KEY (l_comment_id);

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pkey PRIMARY KEY (otp_id);

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_email_key UNIQUE (email);

ALTER TABLE ONLY public.verified_users
    ADD CONSTRAINT verified_users_pkey PRIMARY KEY (rollno);

-- Foreign Keys with CASCADE
ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_campusID_fkey" FOREIGN KEY ("campusID") REFERENCES public.campus("campusID") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.foundpost
    ADD CONSTRAINT foundpost_campusID_fkey FOREIGN KEY ("campusID") REFERENCES public.campus("campusID") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.foundpost
    ADD CONSTRAINT foundpost_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.item(item_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.foundpost
    ADD CONSTRAINT foundpost_rollno_fkey FOREIGN KEY (rollno) REFERENCES public."User"(rollno) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.foundpostcomment
    ADD CONSTRAINT foundpostcomment_f_post_id_fkey FOREIGN KEY (f_post_id) REFERENCES public.foundpost(f_post_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.foundpostcomment
    ADD CONSTRAINT foundpostcomment_rollno_fkey FOREIGN KEY (rollno) REFERENCES public."User"(rollno) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(category_id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.lostpost
    ADD CONSTRAINT lostpost_campusID_fkey FOREIGN KEY ("campusID") REFERENCES public.campus("campusID") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.lostpost
    ADD CONSTRAINT lostpost_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.item(item_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.lostpost
    ADD CONSTRAINT lostpost_rollno_fkey FOREIGN KEY (rollno) REFERENCES public."User"(rollno) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.lostpostcomment
    ADD CONSTRAINT lostpostcomment_l_post_id_fkey FOREIGN KEY (l_post_id) REFERENCES public.lostpost(lpost_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.lostpostcomment
    ADD CONSTRAINT lostpostcomment_rollno_fkey FOREIGN KEY (rollno) REFERENCES public."User"(rollno) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.verified_users
    ADD CONSTRAINT verified_users_rollno_fkey FOREIGN KEY (rollno) REFERENCES public."User"(rollno) ON UPDATE CASCADE ON DELETE CASCADE;

-- SQL query to add profile picture change limit feature (3 times per month)

-- Add columns to User table
ALTER TABLE public."User" 
ADD COLUMN profile_changes_count INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN profile_changes_reset_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL;

-- Create an index for better query performance
CREATE INDEX idx_user_profile_changes ON public."User"(rollno, profile_changes_reset_date);

-- Optional: Add a comment to document the feature
COMMENT ON COLUMN public."User".profile_changes_count IS 'Tracks number of profile picture changes in current month';
COMMENT ON COLUMN public."User".profile_changes_reset_date IS 'Date when the profile changes counter will reset';


-- Enable Row Level Security on tables
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lostpost ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundpost ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lostpostcomment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundpostcomment ENABLE ROW LEVEL SECURITY;

-- Item Policies
CREATE POLICY "Public items are viewable by everyone" 
ON public.item FOR SELECT 
USING (true);

CREATE POLICY "Users can insert items" 
ON public.item FOR INSERT 
WITH CHECK (true); -- Ideally authenticated, but backend handles this

CREATE POLICY "Users can update their own items" 
ON public.item FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own items" 
ON public.item FOR DELETE 
USING (true);

-- User Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public."User" FOR SELECT 
USING (true);

-- Post Policies (Lost)
CREATE POLICY "Lost posts are viewable by everyone" 
ON public.lostpost FOR SELECT 
USING (true);

CREATE POLICY "Users can insert lost posts" 
ON public.lostpost FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update own lost posts" 
ON public.lostpost FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete own lost posts" 
ON public.lostpost FOR DELETE 
USING (true);

-- Post Policies (Found)
CREATE POLICY "Found posts are viewable by everyone" 
ON public.foundpost FOR SELECT 
USING (true);

CREATE POLICY "Users can insert found posts" 
ON public.foundpost FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update own found posts" 
ON public.foundpost FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete own found posts" 
ON public.foundpost FOR DELETE 
USING (true);

ALTER TABLE public.notification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their received notifications"
ON public.notification FOR SELECT
USING (
  receiver = (auth.jwt() ->> 'email')
);

CREATE POLICY "Users can create notifications"
ON public.notification FOR INSERT
WITH CHECK (
  sender = (auth.jwt() ->> 'email')
);

CREATE POLICY "Users can delete their received notifications"
ON public.notification FOR DELETE
USING (
  receiver = (auth.jwt() ->> 'email')
);


DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;

CREATE POLICY "Allow public viewing"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'image-bucket');

CREATE POLICY "Public upload images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'image-bucket');

CREATE POLICY "Public update images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'image-bucket')
WITH CHECK (bucket_id = 'image-bucket');


-- Enable RLS
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundpost ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundpostcomment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lostpost ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lostpostcomment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      r.policyname, r.schemaname, r.tablename
    );
  END LOOP;
END $$;

-- ---------- User ----------
CREATE POLICY "User_select_public_or_self"
ON public."User"
FOR SELECT
TO authenticated
USING (
  account_type = 'public'
  OR email = (auth.jwt() ->> 'email')::text
);

CREATE POLICY "User_insert_self"
ON public."User"
FOR INSERT
TO authenticated
WITH CHECK (
  email = (auth.jwt() ->> 'email')::text
);

CREATE POLICY "User_update_self"
ON public."User"
FOR UPDATE
TO authenticated
USING (
  email = (auth.jwt() ->> 'email')::text
)
WITH CHECK (
  email = (auth.jwt() ->> 'email')::text
);

CREATE POLICY "User_delete_self"
ON public."User"
FOR DELETE
TO authenticated
USING (
  email = (auth.jwt() ->> 'email')::text
);

-- ---------- Foundpost ----------
CREATE POLICY "Foundpost_crud_all"
ON public.foundpost
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ---------- Foundpostcomment ----------
CREATE POLICY "Foundpostcomment_select_all"
ON public.foundpostcomment
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Foundpostcomment_insert_any"
ON public.foundpostcomment
FOR INSERT
TO authenticated
WITH CHECK (
  rollno = (SELECT rollno FROM public."User" WHERE email = (auth.jwt() ->> 'email')::text)
);

CREATE POLICY "Foundpostcomment_update_own"
ON public.foundpostcomment
FOR UPDATE
TO authenticated
USING (
  rollno = (SELECT rollno FROM public."User" WHERE email = (auth.jwt() ->> 'email')::text)
)
WITH CHECK (
  rollno = (SELECT rollno FROM public."User" WHERE email = (auth.jwt() ->> 'email')::text)
);

CREATE POLICY "Foundpostcomment_delete_own"
ON public.foundpostcomment
FOR DELETE
TO authenticated
USING (
  rollno = (SELECT rollno FROM public."User" WHERE email = (auth.jwt() ->> 'email')::text)
);

-- ---------- Lostpost ----------
CREATE POLICY "Lostpost_crud_all"
ON public.lostpost
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ---------- Lostpostcomment ----------
CREATE POLICY "Lostpostcomment_select_all"
ON public.lostpostcomment
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Lostpostcomment_insert_any"
ON public.lostpostcomment
FOR INSERT
TO authenticated
WITH CHECK (
  rollno = (SELECT rollno FROM public."User" WHERE email = (auth.jwt() ->> 'email')::text)
);

CREATE POLICY "Lostpostcomment_update_own"
ON public.lostpostcomment
FOR UPDATE
TO authenticated
USING (
  rollno = (SELECT rollno FROM public."User" WHERE email = (auth.jwt() ->> 'email')::text)
)
WITH CHECK (
  rollno = (SELECT rollno FROM public."User" WHERE email = (auth.jwt() ->> 'email')::text)
);

CREATE POLICY "Lostpostcomment_delete_own"
ON public.lostpostcomment
FOR DELETE
TO authenticated
USING (
  rollno = (SELECT rollno FROM public."User" WHERE email = (auth.jwt() ->> 'email')::text)
);
-- ---------- Notification ----------
CREATE POLICY "Notification_select_self"
ON public.notification
FOR SELECT
TO authenticated
USING (
  receiver = (auth.jwt() ->> 'email')::text
);

CREATE POLICY "Notification_insert_sender"
ON public.notification
FOR INSERT
TO authenticated
WITH CHECK (
  sender = (auth.jwt() ->> 'email')::text
);

CREATE POLICY "Notification_update_self"
ON public.notification
FOR UPDATE
TO authenticated
USING (
  receiver = (auth.jwt() ->> 'email')::text
)
WITH CHECK (
  receiver = (auth.jwt() ->> 'email')::text
);

CREATE POLICY "Notification_delete_self"
ON public.notification
FOR DELETE
TO authenticated
USING (
  receiver = (auth.jwt() ->> 'email')::text
);


INSERT INTO public.campus ("campusID", "campusName") VALUES
(1, 'Lahore'),
(2, 'Multan'),
(3, 'Karachi'),
(4, 'Islamabad');

INSERT INTO public.category (category) VALUES
('Books'),
('Clothes'),
('Electronics'),
('ID Cards'),
('Bags'),
('Stationery'),
('Keys'),
('Mobile Phones'),
('Wallets'),
('Chargers'),
('Headphones'),
('USB / Hard Drives'),
('Calculator'),
('Water Bottles'),
('Other');
