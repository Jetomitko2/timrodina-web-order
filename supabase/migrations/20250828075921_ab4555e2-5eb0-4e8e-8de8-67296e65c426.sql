-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate random 6-digit number in format xxx-xxx
    new_number := LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0') || '-' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
    
    -- Check if this number already exists
    SELECT EXISTS(SELECT 1 FROM public.orders WHERE order_number = new_number) INTO exists_check;
    
    -- If it doesn't exist, we can use it
    IF NOT exists_check THEN
      RETURN new_number;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;