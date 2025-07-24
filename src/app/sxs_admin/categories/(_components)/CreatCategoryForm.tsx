  'use client';

  import React, { useState } from 'react';
  import type { CreateCategoryDTO } from '@/core/dtos/CreateCategory.dto';
  import { CategoryApiRepository } from '@/infrastructure/frontend/repositories/CategoryRepository.api';
  import { ImageApiRepository } from '@/infrastructure/frontend/repositories/ImageRepository.api';
  import { CreateCategoryUseCase } from '@/core/usecases/CreateCategory.usecase';

  export default function CreateCategoryForm() {
    const [categoryName, setCategoryName] = useState<string>('');
    const [seoTitle, setSeoTitle] = useState<string>('');
    const [seoDescription, setSeoDescription] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const categoryRepository = new CategoryApiRepository();
    const imageRepository = new ImageApiRepository(); // This now targets your Next.js API route
    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

    // ... (handleFileChange remains the same)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedFile(null);
        setImagePreviewUrl(null);
      }
    };


    // ⭐ This now calls your Next.js API Route for local storage ⭐
    const handleImageUpload = async () => {
      if (!selectedFile) {
        setError('Please select an image file first!');
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        const data = await imageRepository.upload(selectedFile); // Uploads to /api/upload
        const newImageUrl = data.url; // This URL will be like /uploads/filename.jpg

        setUploadedImageUrl(newImageUrl);
        alert('Image uploaded successfully to local server!');
        setSelectedFile(null);
        setImagePreviewUrl(null);
      } catch (err) {
        console.error('Image upload error:', err);
        setError(`Failed to upload image: ${(err as Error).message}`);
      } finally {
        setIsUploading(false);
      }
    };

    // ⭐ This still sends the URL to your main backend API ⭐
      const handleSubmitCategory = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!categoryName.trim()) {
          setError('Category name cannot be empty.');
          return;
        }

        if (!uploadedImageUrl) {
          setError('Please upload an image before creating the category.');
          return;
        }

        setIsSubmitting(true);

      const categoryData: CreateCategoryDTO = {
        name: categoryName,
        imageUrl:uploadedImageUrl, // URL is from your Next.js local server
        seoTitle,
        seoDescription,
      };

      try {
        const createdCategory = await createCategoryUseCase.execute(categoryData);

        console.log('Category created successfully:', createdCategory);
        alert('Category created successfully!');
        setCategoryName('');
        setUploadedImageUrl(null);
      } catch (err) {
        console.error('Category creation error:', err);
        setError(`Failed to create category: ${(err as Error).message}`);
      } finally {
        setIsSubmitting(false);
      }
    };

    // ... (rest of the form JSX remains exactly the same)
    return (
      <form onSubmit={handleSubmitCategory} className="space-y-6 p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto my-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Create New Category</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">&quot;{error}&quot;</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">&quot;{successMessage}&quot;</span>
          </div>
        )}

        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name:
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
          <input
            type="text"
            id="seoTitle"
            name="seoTitle"
            value={seoTitle}
            onChange={e => setSeoTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="SEO Title for this category"
          />
        </div>

        <div>
          <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            value={seoDescription}
            onChange={e => setSeoDescription(e.target.value)}
            rows={2}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="SEO Description for this category"
          ></textarea>
        </div>

        <div>
          <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700 mb-1">
            Select Image:
          </label>
          <input
            type="file"
            id="categoryImage"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            disabled={isUploading || isSubmitting}
          />
          {selectedFile && (
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={isUploading || isSubmitting}
              className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Image Locally'}
            </button>
          )}
        </div>

        {imagePreviewUrl && !uploadedImageUrl && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
            <h4 className="text-base font-semibold text-gray-800 mb-2">Image Preview:</h4>
            <img src={imagePreviewUrl} alt="Image Preview" className="max-w-full h-auto mx-auto rounded-md shadow-sm" style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain' }} />
            <p className="text-xs text-gray-500 mt-2">This is a local preview. Click &quot;Upload Image Locally&quot; to save it.</p>
          </div>
        )}

        {uploadedImageUrl && (
          <div className="mt-4 p-4 border border-green-200 rounded-md bg-green-50 text-center">
            <h4 className="text-base font-semibold text-green-800 mb-2">Uploaded Image:</h4>
            <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 break-all text-sm">
              {uploadedImageUrl}
            </a>
            <img src={uploadedImageUrl} alt="Uploaded Category Image" className="mt-2 max-w-full h-auto mx-auto rounded-md shadow-sm" style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain' }} />
            <p className="text-xs text-gray-600 mt-2">This image has been uploaded and will be linked to the category.</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!categoryName.trim() || !uploadedImageUrl || isSubmitting || isUploading}
        >
          {isSubmitting ? 'Creating Category...' : 'Create Category'}
        </button>
      </form>
    );
  }