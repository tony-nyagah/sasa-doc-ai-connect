/*
  # Community Groups and Members Schema

  1. New Tables
    - `community_groups`
      - `id` (uuid, primary key)
      - `name` (text, group name)
      - `description` (text, group description)
      - `condition` (text, medical condition focus)
      - `is_private` (boolean, privacy setting)
      - `member_count` (integer, cached member count)
      - `created_by` (uuid, creator user id)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `group_members`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key to community_groups)
      - `user_id` (uuid, foreign key to profiles)
      - `role` (text, member role)
      - `joined_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for group access and membership management
    - Ensure privacy controls for private groups

  3. Functions
    - Trigger to update member count when members join/leave
*/

-- Create community_groups table
CREATE TABLE IF NOT EXISTS community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  condition TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  member_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_groups
CREATE POLICY "Anyone can view public groups" ON community_groups
  FOR SELECT USING (NOT is_private OR created_by = auth.uid());

CREATE POLICY "Members can view private groups they belong to" ON community_groups
  FOR SELECT USING (
    is_private AND EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = community_groups.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create groups" ON community_groups
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Group creators can update their groups" ON community_groups
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for group_members
CREATE POLICY "Users can view memberships of groups they can see" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM community_groups 
      WHERE id = group_id AND (
        NOT is_private OR 
        created_by = auth.uid() OR 
        EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = id AND gm.user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can join groups" ON group_members
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave groups" ON group_members
  FOR DELETE USING (user_id = auth.uid());

-- Function to update member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_groups 
    SET member_count = member_count + 1,
        updated_at = now()
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_groups 
    SET member_count = GREATEST(member_count - 1, 0),
        updated_at = now()
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update member count
CREATE TRIGGER update_member_count_trigger
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Insert sample community groups
INSERT INTO community_groups (name, description, condition, is_private, member_count) VALUES
  ('Diabetes Support Circle', 'A supportive community for people managing diabetes and their families.', 'Diabetes', false, 156),
  ('Heart Health Warriors', 'Connect with others on their cardiovascular health journey.', 'Cardiovascular Disease', false, 89),
  ('Mental Wellness Hub', 'Safe space for mental health discussions and support.', 'Mental Health', false, 234),
  ('Cancer Survivors Network', 'Strength through shared experiences and hope.', 'Cancer', false, 67),
  ('Chronic Pain Support', 'Understanding and managing chronic pain together.', 'Chronic Pain', false, 123),
  ('Anxiety & Depression Circle', 'Private group for anxiety and depression support.', 'Anxiety/Depression', true, 45),
  ('Autoimmune Warriors', 'Living well with autoimmune conditions.', 'Autoimmune Disorders', false, 78),
  ('Pregnancy & Motherhood', 'Support for expecting and new mothers.', 'Pregnancy/Maternal Health', false, 198);