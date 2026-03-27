-- Fix 1: Add INSERT policy for payments table
CREATE POLICY "Users can create their own payments"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix 2: Add server-side fare calculation trigger to prevent price manipulation
CREATE OR REPLACE FUNCTION public.calculate_trip_fare()
RETURNS TRIGGER AS $$
DECLARE
  base_price DECIMAL := 25;
  per_km DECIMAL := 12;
  multiplier DECIMAL := 1;
BEGIN
  -- Set multiplier based on ride type
  IF NEW.ride_type = 'luxury' THEN
    multiplier := 2.2;
    base_price := 50;
    per_km := 25;
  ELSIF NEW.ride_type = 'ev' THEN
    multiplier := 1.2;
    base_price := 30;
    per_km := 14;
  END IF;
  
  -- Calculate and override fare server-side (ignore client-submitted fare)
  IF NEW.distance_km IS NOT NULL AND NEW.distance_km > 0 THEN
    NEW.fare := ROUND((base_price + (NEW.distance_km * per_km)) * multiplier);
  ELSE
    -- Default minimum fare if no distance
    NEW.fare := base_price;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic fare calculation on trips
CREATE TRIGGER set_trip_fare
BEFORE INSERT OR UPDATE ON public.trips
FOR EACH ROW
EXECUTE FUNCTION public.calculate_trip_fare();