-- Create table for detected machines
CREATE TABLE IF NOT EXISTS public.machines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  muscles TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- Public access policies (no authentication required for this app)
CREATE POLICY "Anyone can view machines" 
ON public.machines 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create machines" 
ON public.machines 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update machines" 
ON public.machines 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete machines" 
ON public.machines 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_machines_updated_at
BEFORE UPDATE ON public.machines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();