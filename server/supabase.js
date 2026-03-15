const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_KEY not set — image uploads will fail');
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const BUCKET = 'menu-images';

async function uploadImage(buffer, filename, mimetype) {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

async function deleteImage(publicUrl) {
  if (!supabase) return;
  try {
    const parts = publicUrl.split(`/storage/v1/object/public/${BUCKET}/`);
    if (parts.length < 2) return;
    const filePath = parts[1];
    await supabase.storage.from(BUCKET).remove([filePath]);
  } catch (err) {
    console.error('Failed to delete image from Supabase:', err.message);
  }
}

module.exports = { uploadImage, deleteImage, BUCKET };
