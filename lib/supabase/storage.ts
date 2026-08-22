import { supabase, isSupabaseConfigured } from "./client";

/**
 * Helper to upload files to Supabase Storage with graceful fallback
 */
export async function uploadChatAttachment(
  file: File | Blob,
  fileName: string,
  bucket: "chat-attachments" | "voice-notes" = "chat-attachments"
): Promise<{ url: string; error?: string }> {
  if (!isSupabaseConfigured) {
    // Return Local Object URL or Base64 Data URL if Supabase is in local demo mode
    const objectUrl = URL.createObjectURL(file);
    return { url: objectUrl };
  }

  try {
    const fileExt = fileName.split(".").pop() || "bin";
    const uniquePath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniquePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.warn(`Supabase Storage upload to '${bucket}' failed, falling back to local URL:`, error.message);
      return { url: URL.createObjectURL(file) };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  } catch (err: unknown) {
    console.error("Storage upload exception:", err);
    return { url: URL.createObjectURL(file) };
  }
}
