-- Add phone number and verification status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_otp TEXT,
ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);

-- Update RLS policy to allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);