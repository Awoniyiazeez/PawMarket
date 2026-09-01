import { supabase } from "./supabase";

export async function uploadDogImage(file) {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `dogs/${fileName}`;

  const { data, error } = await supabase.storage
    .from("dog-images")
    .upload(filePath, file);

  if (error) {
    console.error("Image upload failed:", error);
    alert("Image upload error: " + error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("dog-images")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}