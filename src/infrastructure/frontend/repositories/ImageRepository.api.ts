// src/infrastructure/frontend/repositories/ImageRepository.api.ts

export class ImageApiRepository {
  // We don't need a separate BASE_URL for this, as it's an internal API route.
  // Next.js handles routing /api/upload to the correct file.
  private readonly UPLOAD_ENDPOINT = '/api/upload'; // This points to your Next.js API Route

  /**
   * Uploads an image file to the Next.js API route and returns its public URL.
   * @param file The File object selected by the user.
   * @returns A promise that resolves to an object containing the image URL.
   * @throws An error if the upload fails.
   */
  async upload(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file); // 'image' must match the key expected by your API route

    try {
      const response = await fetch(this.UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
        // No 'Content-Type' header needed for FormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown upload error' }));
        throw new Error(`Local upload failed: ${response.statusText} - ${errorData.message || errorData.message || 'Server error'}`);
      }

      const data = await response.json();
      if (!data.url) {
        throw new Error('Upload response did not contain a URL.');
      }
      return { url: data.url };
    } catch (err) {
      console.error('Image upload error (Next.js API Route):', err);
      throw new Error(`Failed to upload image locally: ${(err as Error).message}`);
    }
  }
}