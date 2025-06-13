// src/data/mockdata.ts
import { createClient } from '@supabase/supabase-js';

// Type definition (same structure as before)
export type ColorPalette = {
  id: number;
  name: string;
  hex_codes: string[];
  tags: string[];
  likes_count: number;
  downloads_count: number;
  created_at: string;
  updated_at: string;
};

// Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Fetch all palettes
export const fetchPalettes = async (): Promise<ColorPalette[]> => {
  const { data, error } = await supabase
    .from('palettes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching palettes:', error.message);
    return [];
  }

  return data as ColorPalette[];
};

// ✅ Matches the exact format you asked for
export const getMockPaletteById = async (
  id: string
): Promise<ColorPalette | undefined> => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) return undefined;

  const { data, error } = await supabase
    .from('palettes')
    .select('*')
    .eq('id', parsedId)
    .single();

  if (error) {
    console.error(`Error fetching palette with ID ${id}:`, error.message);
    return undefined;
  }

  return data as ColorPalette;
};




// Function to update likes count for a palette
export const updatePaletteLikes = async (paletteId: number, newLikesCount: number): Promise<boolean> => {
  const { data, error } = await supabase
    .from("palettes")
    .update({ likes_count: newLikesCount })
    .eq("id", paletteId);

  if (error) {
    console.error(`Error updating likes for palette ${paletteId}:`, error.message);
    return false;
  }
  console.log(`Successfully updated likes for palette ${paletteId} to ${newLikesCount}`);
  return true;
};


