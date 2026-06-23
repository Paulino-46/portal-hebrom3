// lib/blob.ts
import { put, del } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;

export async function uploadBlob(
  path: string,
  file: File | Blob
): Promise<string> {
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN não definido. Verifique o ficheiro .env.local."
    );
  }
  const blob = await put(path, file, { access: "public", token });
  return blob.url;
}

export async function deleteBlob(url: string | null | undefined): Promise<void> {
  if (!url || !token) return;
  try {
    await del(url, { token });
  } catch {
    console.warn("Não foi possível remover o blob:", url);
  }
}