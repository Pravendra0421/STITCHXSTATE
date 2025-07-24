'use client'; // This directive is crucial for client components

import React, { ChangeEvent, FormEvent, useCallback, useState, useEffect } from 'react';
import { ProductApiRepository } from '@/infrastructure/frontend/repositories/ProductRepository.api';
import { getProductByIdUSeCase } from '@/core/usecases/GetProductById.usecase';
import { UpdateProductUseCase } from '@/core/usecases/UpdateProduct.usecase';
import { CreateProductDTO } from '@/core/dtos/CreateProduct.dto';
import { CategoryApiRepository } from '@/infrastructure/frontend/repositories/CategoryRepository.api';
import { ImageApiRepository } from '@/infrastructure/frontend/repositories/ImageRepository.api';
import { CategoryEntity } from '@/core/entities/category.entity';

interface Category {
  id: string;
  name: string;
}

// Props for the UpdateProductForm component
interface UpdateProductFormProps {
  productId: string; // This prop is essential to know which product to update
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({ productId }) => {
  const [productData, setProductData] = useState<CreateProductDTO>({
    name: '',
    description: '',
    categoryIds: [],
    variations: [],
    thumbnailVideo: '',
    galleryImages: [],
    seoTitle: '',
    seoDescription: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Set to true initially to show loading state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State for image upload specific loading and preview
  const [isUploadingGalleryImage, setIsUploadingGalleryImage] = useState<boolean>(false);
  const [isUploadingVariationImage, setIsUploadingVariationImage] = useState<boolean[]>([]);
  const [currentGalleryImagePreview, setCurrentGalleryImagePreview] = useState<string | null>(null);
  const [currentVariationImagePreviews, setCurrentVariationImagePreviews] = useState<string[][]>([]);

  // Backend API call instances (initialized once)
  const productRepository = new ProductApiRepository();
  const getProductByIdUseCase = new getProductByIdUSeCase(productRepository);
  const updateProductUseCase = new UpdateProductUseCase(productRepository);
  const imageRepository = new ImageApiRepository();
  const categoryApiRepository = new CategoryApiRepository();

  // Helper function for showing custom messages
  const showCustomMessage = useCallback((message: string, isError: boolean = false) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (isError) {
      setErrorMessage(message);
    } else {
      setSuccessMessage(message);
    }

    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 5000);
  }, []);

  // --- Fetch Product and Categories on Mount/Id Change ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories first
        const fetchedCategories = await categoryApiRepository.findAll();
        setCategories(fetchedCategories || []);

        // Then, fetch the product data to be updated
        const fetchedProduct = await getProductByIdUseCase.execute(productId);
        if (!fetchedProduct) {
          throw new Error('Product not found.'); // Throw an error to be caught by the catch block
        }
        // Populate the form state with fetched data
        setProductData({
          name: fetchedProduct.name,
          description: fetchedProduct.description,
          // FIX: Map the category objects to their IDs (strings)
          categoryIds: fetchedProduct.categories?.map((cat: CategoryEntity) => cat.id) || [],
          variations: fetchedProduct.variations || [],
          thumbnailVideo: fetchedProduct.thumbnailVideo || '',
          galleryImages: fetchedProduct.galleryImages || [],
          seoTitle: fetchedProduct.seoTitle || '',
          seoDescription: fetchedProduct.seoDescription || '',
        });
        
        // Initialize variation image upload states
        setIsUploadingVariationImage(new Array(fetchedProduct.variations?.length || 0).fill(false));
        setCurrentVariationImagePreviews(new Array(fetchedProduct.variations?.length || 0).fill([]));

        showCustomMessage('Product data loaded successfully.');
      } catch (error: any) {
        console.error("Failed to fetch product or categories:", error);
        showCustomMessage(`Failed to load product data: ${error.message || 'Product not found.'}`, true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]); // Re-run effect when productId changes

  // Handle product field changes (name, description, thumbnailVideo)
  const handleProductChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Handle category IDs from a multi-select dropdown
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    setProductData(prev => ({ ...prev, categoryIds: [selectedCategoryId] }));
  }, []);

  const handleVideoUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('video/')) {
      showCustomMessage('Please select a video file.', true);
      return;
    }

    const videoPreviewUrl = URL.createObjectURL(file);
    setProductData(prev => ({ ...prev, thumbnailVideo: videoPreviewUrl }));

    try {
      const { url: uploadedVideoUrl } = await imageRepository.upload(file);
      setProductData(prev => ({ ...prev, thumbnailVideo: uploadedVideoUrl }));
      showCustomMessage('Video uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading video:', error);
      showCustomMessage(`Error uploading video: ${error.message || 'Something went wrong.'}`, true);
    } finally {
      event.target.value = '';
    }
  }, [imageRepository]);

  // Image upload handler
  const handleImageUpload = useCallback(async (
    event: ChangeEvent<HTMLInputElement>,
    type: 'gallery' | 'variation',
    variationIndex?: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (type === 'gallery') {
      setIsUploadingGalleryImage(true);
      setCurrentGalleryImagePreview(URL.createObjectURL(file));
    } else if (type === 'variation' && variationIndex !== undefined) {
      setIsUploadingVariationImage((prev) => {
        const newState = [...prev];
        newState[variationIndex] = true;
        return newState;
      });
      setCurrentVariationImagePreviews((prev) => {
        const newState = [...prev];
        newState[variationIndex] = newState[variationIndex] || [];
        newState[variationIndex][0] = URL.createObjectURL(file);
        return newState;
      });
    }

    try {
      const { url: uploadedImageUrl } = await imageRepository.upload(file);
      showCustomMessage('Image uploaded successfully!');

      if (type === 'gallery') {
        handleAddGalleryImage(uploadedImageUrl);
        setCurrentGalleryImagePreview(null);
      } else if (type === 'variation' && variationIndex !== undefined) {
        handleAddVariationImage(variationIndex, uploadedImageUrl);
        setCurrentVariationImagePreviews((prev) => {
          const newState = [...prev];
          newState[variationIndex] = [];
          return newState;
        });
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      showCustomMessage(`Error uploading image: ${error.message || 'Something went wrong.'}`, true);
      if (type === 'gallery') {
        setCurrentGalleryImagePreview(null);
      } else if (type === 'variation' && variationIndex !== undefined) {
        setCurrentVariationImagePreviews((prev) => {
          const newState = [...prev];
          newState[variationIndex] = [];
          return newState;
        });
      }
    } finally {
      if (type === 'gallery') {
        setIsUploadingGalleryImage(false);
      } else if (type === 'variation' && variationIndex !== undefined) {
        setIsUploadingVariationImage((prev) => {
          const newState = [...prev];
          newState[variationIndex] = false;
          return newState;
        });
      }
      event.target.value = '';
    }
  }, [imageRepository, showCustomMessage]);

  // --- Gallery Images (Product Level) ---
  const handleAddGalleryImage = useCallback((url: string) => {
    if (url.trim()) {
      setProductData((prevData) => ({
        ...prevData,
        galleryImages: [...(prevData.galleryImages || []), { url: url.trim() }],
      }));
    }
  }, []);

  const handleRemoveGalleryImage = useCallback((index: number) => {
    setProductData((prevData) => ({
      ...prevData,
      galleryImages: (prevData.galleryImages || []).filter((_, i) => i !== index),
    }));
  }, []);

  const handleAddVariation = useCallback(() => {
    setProductData((prevData) => ({
      ...prevData,
      variations: [
        ...(prevData.variations || []),
        {
            id:'',
          size: '',
          color: '',
          price: 0,
          salePrice: 0,
          stock: 0,
          images: [],
        },
      ],
    }));
    setIsUploadingVariationImage((prev) => [...prev, false]);
    setCurrentVariationImagePreviews((prev) => [...prev, []]);
  }, []);

  const handleRemoveVariation = useCallback((index: number) => {
    setProductData((prevData) => ({
      ...prevData,
      variations: (prevData.variations || []).filter((_, i) => i !== index),
    }));
    setIsUploadingVariationImage((prev) => prev.filter((_, i) => i !== index));
    setCurrentVariationImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Handle changes within a specific variation
  const handleVariationChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      setProductData((prevData) => {
        const newVariations = [...(prevData.variations || [])];
        if (newVariations[index]) {
          (newVariations[index] as any)[name] =
            type === 'number' ? parseFloat(value) || 0 : value;
        }
        return { ...prevData, variations: newVariations };
      });
    },
    [],
  );

  // --- Variation Images ---
  const handleAddVariationImage = useCallback((variationIndex: number, url: string) => {
    if (url.trim()) {
      setProductData((prevData) => {
        const newVariations = [...(prevData.variations || [])];
        if (newVariations[variationIndex]) {
          newVariations[variationIndex].images = [
            ...(newVariations[variationIndex].images || []),
            { url: url.trim() },
          ];
        }
        return { ...prevData, variations: newVariations };
      });
    }
  }, []);

  const handleRemoveVariationImage = useCallback(
    (variationIndex: number, imageIndex: number) => {
      setProductData((prevData) => {
        const newVariations = [...(prevData.variations || [])];
        if (newVariations[variationIndex]) {
          newVariations[variationIndex].images = (
            newVariations[variationIndex].images || []
          ).filter((_, i) => i !== imageIndex);
        }
        return { ...prevData, variations: newVariations };
      });
    },
    [],
  );

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Use the UpdateProductUseCase instead of CreateProductUseCase
      const updatedProduct = await updateProductUseCase.execute(productId, productData);
      showCustomMessage('Product updated successfully!');
      console.log('Product updated successfully:', updatedProduct);

      // No need to reset the form data completely after update, just show a message.
      // The form should stay populated with the current data.

    } catch (error: any) {
      console.error('Error updating product:', error);
      showCustomMessage(`Error: ${error.message || 'Something went wrong.'}`, true);
    } finally {
      setLoading(false);
    }
  }, [productId, productData, updateProductUseCase, showCustomMessage]);

  // --- JSX Rendering ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-inter overflow-y-auto max-h-[900px]">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Update Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Product Details */}
          <section className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Information</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={productData.name || ''}
                onChange={handleProductChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={productData.description || ''}
                onChange={handleProductChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input
                type="text"
                id="seoTitle"
                name="seoTitle"
                value={productData.seoTitle || ''}
                onChange={handleProductChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="SEO Title for this product"
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                value={productData.seoDescription || ''}
                onChange={handleProductChange}
                rows={2}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="SEO Description for this product"
              ></textarea>
            </div>
            <div className="mt-4">
              <label htmlFor="categoryIds" className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
              <select
                id="categoryIds"
                name="categoryIds"
                value={productData.categoryIds?.[0] || ''}
                onChange={handleCategoryChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-auto"
              >
                <option value="">Select a category</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading categories...</option>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">Select one category for the product.</p>
            </div>
            <div className="mt-4">
              <label htmlFor="thumbnailVideoUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload Thumbnail Video</label>
              <input
                  type="file"
                  id="thumbnailVideoUpload"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {productData.thumbnailVideo && (
                  <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Current Thumbnail Video:</p>
                      <video src={productData.thumbnailVideo} controls className="max-w-full max-h-64 border border-gray-300 rounded-md" />
                  </div>
              )}
            </div>
          </section>

          {/* Product Gallery Images */}
          <section className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Gallery Images</h2>
            <div className="flex items-end space-x-2 mb-4">
              <div className="flex-grow">
                <label htmlFor="galleryImageUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload Gallery Image</label>
                <input
                  type="file"
                  id="galleryImageUpload"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'gallery')}
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-white focus:outline-none"
                  disabled={isUploadingGalleryImage}
                />
              </div>
              {isUploadingGalleryImage && (
                <div className="flex items-center justify-center p-2">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                </div>
              )}
            </div>
            {currentGalleryImagePreview && (
              <div className="mt-2 mb-4 relative group rounded-md overflow-hidden shadow-sm border border-gray-200 w-fit">
                <img
                  src={currentGalleryImagePreview}
                  alt="Gallery Image Preview"
                  className="w-32 h-32 object-cover"
                />
                <p className="text-xs text-gray-500 text-center mt-1">Previewing image for upload</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(productData.galleryImages || []).map((image, index) => (
                <div key={index} className="relative group rounded-md overflow-hidden shadow-sm border border-gray-200">
                  <img
                    src={image.url}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-24 object-cover"
                    onError={(e) => e.currentTarget.src = `https://placehold.co/100x100/cccccc/ffffff?text=Error`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    ×
                  </button>
                </div>
              ))}
              {(productData.galleryImages || []).length === 0 && !currentGalleryImagePreview && (
                <p className="text-sm text-gray-500 col-span-full text-center">No gallery images added yet. Upload one!</p>
              )}
            </div>
          </section>

          {/* Product Variations */}
          <section className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Variations</h2>
            {productData.variations?.map((variation, varIndex) => (
              <div key={varIndex} className="p-4 mb-4 border border-gray-300 rounded-md bg-white shadow-sm relative">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Variation {varIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveVariation(varIndex)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={variation.size}
                      onChange={(e) => handleVariationChange(varIndex, e)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={variation.color}
                      onChange={(e) => handleVariationChange(varIndex, e)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                    <input
                      type="number"
                      name="price"
                      value={variation.price}
                      onChange={(e) => handleVariationChange(varIndex, e)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (Rs.)</label>
                    <input
                      type="number"
                      name="salePrice"
                      value={variation.salePrice}
                      onChange={(e) => handleVariationChange(varIndex, e)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={variation.stock}
                      onChange={(e) => handleVariationChange(varIndex, e)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                      min="0"
                    />
                  </div>
                </div>

                {/* Variation Images */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Images for this Variation</h4>
                  <div className="flex items-end space-x-2 mb-4">
                    <div className="flex-grow">
                      <label htmlFor={`variationImageUpload-${varIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Upload Variation Image</label>
                      <input
                        type="file"
                        id={`variationImageUpload-${varIndex}`}
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'variation', varIndex)}
                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-white focus:outline-none"
                        disabled={isUploadingVariationImage[varIndex]}
                      />
                    </div>
                    {isUploadingVariationImage[varIndex] && (
                      <div className="flex items-center justify-center p-2">
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                      </div>
                    )}
                  </div>
                  {isUploadingVariationImage[varIndex] && currentVariationImagePreviews[varIndex]?.[0] && (
                    <div className="mt-2 mb-4 relative group rounded-md overflow-hidden shadow-sm border border-gray-200 w-fit">
                      <img
                        src={currentVariationImagePreviews[varIndex][0]}
                        alt="Variation Image Preview"
                        className="w-24 h-24 object-cover"
                      />
                      <p className="text-xs text-gray-500 text-center mt-1">Previewing image for upload</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(variation.images || []).map((image, imgIndex) => (
                      <div key={imgIndex} className="relative group rounded-md overflow-hidden shadow-sm border border-gray-200">
                        <img
                          src={image.url}
                          alt={`Variation Image ${imgIndex + 1}`}
                          className="w-full h-20 object-cover"
                          onError={(e) => e.currentTarget.src = `https://placehold.co/80x80/cccccc/ffffff?text=Error`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariationImage(varIndex, imgIndex)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {(variation.images || []).length === 0 && !(currentVariationImagePreviews[varIndex] && currentVariationImagePreviews[varIndex][0]) && (
                      <p className="text-sm text-gray-500 col-span-full text-center">No images for this variation yet. Upload one!</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddVariation}
              className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors duration-300 mt-4"
            >
              Add New Variation
            </button>
            {(productData.variations || []).length === 0 && (
                <p className="text-sm text-gray-500 text-center mt-4">No variations added yet. Add at least one.</p>
            )}
          </section>

          {/* Submission and Messages */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
            disabled={loading || isUploadingGalleryImage || isUploadingVariationImage.some(Boolean)}
          >
            {loading ? 'Updating Product...' : 'Update Product'}
          </button>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">&quot;{successMessage}&quot;</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">&quot;{errorMessage}&quot;</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateProductForm;