'use client';

import React, { useState, useEffect } from 'react';
import { UpdateCategoryDTO } from '@/core/dtos/CreateCategory.dto';
import { CategoryApiRepository } from '@/infrastructure/frontend/repositories/CategoryRepository.api';
import { ImageApiRepository } from '@/infrastructure/frontend/repositories/ImageRepository.api';
import { UpdateCategoryUseCase } from '@/core/usecases/UpdateCategory.usecase';
import type { CategoryEntity } from '@/core/entities/category.entity';

interface CategoryEditFormProps {
  initialCategory: CategoryEntity;
  categoryId: string; 
}

export function CategoryEditForm({ initialCategory, categoryId }: CategoryEditFormProps) {
  // const router = useRouter(); // Uncomment if you need client-side navigation

  // Initialize state with data from initialCategory prop
  const [categoryName, setCategoryName] = useState<string>(initialCategory.name || '');
  const [seoTitle, setSeoTitle] = useState<string>(initialCategory.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState<string>(initialCategory.seoDescription || '');
  // Now we only manage a single imageUrl string
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(initialCategory.imageUrl || null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // For local file preview
  const [newlyUploadedImageUrl, setNewlyUploadedImageUrl] = useState<string | null>(null); // For the URL of a newly uploaded file

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const categoryRepository = new CategoryApiRepository();
  const imageApiRepository = new ImageApiRepository();
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);

  // useEffect to update form state if initialCategory prop changes
  useEffect(() => {
    setCategoryName(initialCategory.name || '');
    setCurrentImageUrl(initialCategory.imageUrl || null); // Set current image from prop
    // Reset temporary image upload states when initialCategory changes
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setNewlyUploadedImageUrl(null);
    setError(null);
    setSuccessMessage(null);
  }, [initialCategory]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMessage(null);
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

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file first!');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data = await imageApiRepository.upload(selectedFile);
      const newUrl = data.url;

      setNewlyUploadedImageUrl(newUrl); // Store this as the potential new image for the category
      // setSuccessMessage('Image uploaded successfully to local server! Click &quot;Update Category&quot; to save changes.');
      setSuccessMessage('Image uploaded. Click &quot;Update Category&quot; to save changes.'); // Better message
      setSelectedFile(null);
      setImagePreviewUrl(null);
    } catch (err) {
      console.error('Image upload error:', err);
      setError(`Failed to upload image: ${(err as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!categoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    setIsSubmitting(true);

    // Determine which image URL to send: newly uploaded, or existing current one
    const imageToSend = newlyUploadedImageUrl || currentImageUrl;

    const categoryData: UpdateCategoryDTO = {
      name: categoryName.trim(),
      imageUrl: imageToSend, // Pass the single image URL
      seoTitle,
      seoDescription,
    };

    try {
      const updatedCategory = await updateCategoryUseCase.execute(categoryId, categoryData);

      console.log('Category updated successfully:', updatedCategory);
      setSuccessMessage('Category updated successfully!');
      // Update currentImageUrl state in case a new image was just uploaded and saved
      if (newlyUploadedImageUrl) {
        setCurrentImageUrl(newlyUploadedImageUrl);
        setNewlyUploadedImageUrl(null); // Clear temporary new image state
      }
      // Optionally, redirect
      // router.push('/sxs_admin/categories');
    } catch (err) {
      console.error('Category update error:', err);
      setError(`Failed to update category: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitCategory} className="space-y-6 p-6  bg-white shadow-lg rounded-lg w-full mx-auto my-8">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Edit Category: {initialCategory.name}</h2>

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

      {/* Display Current Image (if any) */}
      {currentImageUrl && !newlyUploadedImageUrl && ( // Show current if no new one pending
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
          <h4 className="text-base font-semibold text-gray-800 mb-2">Current Category Image:</h4>
          <img src={currentImageUrl} alt="Current Category Image" className="max-w-full h-auto mx-auto rounded-md shadow-sm" style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain' }} />
          <p className="text-xs text-gray-500 mt-2">This is the image currently associated with the category.</p>
          <button
            type="button"
            onClick={() => {
              setCurrentImageUrl(null); // Clear the current image
              setError(null);
              setSuccessMessage(null);
            }}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            Remove Current Image
          </button>
        </div>
      )}

      <div>
        <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700 mb-1">
          {currentImageUrl ? 'Replace Image (or leave for current)' : 'Select Image:'}
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
            {isUploading ? 'Uploading...' : 'Upload New Image Locally'}
          </button>
        )}
      </div>

      {imagePreviewUrl && !newlyUploadedImageUrl && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
          <h4 className="text-base font-semibold text-gray-800 mb-2">New Image Preview:</h4>
          <img src={imagePreviewUrl} alt="New Image Preview" className="max-w-full h-auto mx-auto rounded-md shadow-sm" style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain' }} />
          <p className="text-xs text-gray-500 mt-2">This is a local preview of the file you selected. Click &quot;Upload New Image Locally&quot; to stage it for replacement.</p>
        </div>
      )}

      {newlyUploadedImageUrl && (
        <div className="mt-4 p-4 border border-green-200 rounded-md bg-green-50 text-center">
          <h4 className="text-base font-semibold text-green-800 mb-2">Newly Uploaded Image (Pending Save):</h4>
          <a href={newlyUploadedImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 break-all text-sm">
            {newlyUploadedImageUrl}
          </a>
          <img src={newlyUploadedImageUrl} alt="Newly Uploaded Category Image" className="mt-2 max-w-full h-auto mx-auto rounded-md shadow-sm" style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain' }} />
          <p className="text-xs text-gray-600 mt-2">This new image has been uploaded to the server. Click &quot;Update Category&quot; to replace the current image with this one.</p>
          <button
            type="button"
            onClick={() => {
              setNewlyUploadedImageUrl(null); // Clear pending new image
              setSelectedFile(null);
              setImagePreviewUrl(null);
              setError(null);
              setSuccessMessage(null);
            }}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            Cancel New Image Upload
          </button>
        </div>
      )}

      <button
        type="submit"
        className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!categoryName.trim() || isSubmitting || isUploading} // No longer strictly requires an image if it's optional
      >
        {isSubmitting ? 'Updating Category...' : 'Update Category'}
      </button>
    </form>
  );
}