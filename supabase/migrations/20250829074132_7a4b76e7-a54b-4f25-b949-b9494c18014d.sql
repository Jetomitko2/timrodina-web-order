-- Add email column to orders table
ALTER TABLE public.orders ADD COLUMN email TEXT NOT NULL DEFAULT '';