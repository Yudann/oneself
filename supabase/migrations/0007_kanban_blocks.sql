-- 0007_kanban_blocks.sql

-- Add parent_id to blocks table to support hierarchy (Kanban Board -> Column -> Card)
alter table public.blocks
add column parent_id uuid references public.blocks(id) on delete cascade;

-- Index for performance
create index idx_blocks_parent_id on public.blocks(parent_id);

-- Verify that existing blocks have null parent_id (default behavior usually, but good to be safe)
-- update public.blocks set parent_id = null where parent_id is null;  -- Redundant but documents intent.
