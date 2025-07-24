'use client';
import React from 'react';
import { TwoImageFlexSection, FlexImage } from '@/core/entities/HomePage.entity';
import ImageUploadPreview from './ImageUploadPreview'; // Ensure correct path
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming you might need Textarea for title/subtitle
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs if needed for FlexImage

interface TwoImageFlexSectionProps {
  section: TwoImageFlexSection;
  onSectionChange: (newSection: TwoImageFlexSection) => void;
  onFileUpload: (file: File) => Promise<string>;
}

const TwoImageFlexSectionEditor = ({
  section,
  onSectionChange,
  onFileUpload,
}: TwoImageFlexSectionProps) => {

  const handleImageChange = (
    imageKey: 'image1' | 'image2',
    field: keyof FlexImage,
    value: string
  ) => {
    onSectionChange({
      ...section,
      [imageKey]: {
        ...section[imageKey],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Two Image Flex Section Settings</h3>

      {/* Image 1 Editor */}
      <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
        <h4 className="text-lg font-semibold text-indigo-700 mb-3">Image 1 Settings</h4>
        <ImageUploadPreview
          label="Image 1 URL"
          imageUrl={section.image1.url}
          onImageUrlChange={(url) => handleImageChange('image1', 'url', url)}
          onFileUpload={onFileUpload}
        />
        <div className="mb-3">
          <label htmlFor={`flex-image1-alt-${section.id}`}>Alt Text (Image 1)</label>
          <Input
            id={`flex-image1-alt-${section.id}`}
            type="text"
            value={section.image1.alt}
            onChange={(e) => handleImageChange('image1', 'alt', e.target.value)}
            required
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Descriptive text for accessibility.</p>
        </div>
        <div className="mb-3">
          <label htmlFor={`flex-image1-title-${section.id}`}>Title (Image 1 - Optional)</label>
          <Input
            id={`flex-image1-title-${section.id}`}
            type="text"
            value={section.image1.title || ''}
            onChange={(e) => handleImageChange('image1', 'title', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor={`flex-image1-subtitle-${section.id}`}>Subtitle (Image 1 - Optional)</label>
          <Textarea
            id={`flex-image1-subtitle-${section.id}`}
            value={section.image1.subtitle || ''}
            onChange={(e) => handleImageChange('image1', 'subtitle', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Image 2 Editor */}
      <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm mt-6">
        <h4 className="text-lg font-semibold text-indigo-700 mb-3">Image 2 Settings</h4>
        <ImageUploadPreview
          label="Image 2 URL"
          imageUrl={section.image2.url}
          onImageUrlChange={(url) => handleImageChange('image2', 'url', url)}
          onFileUpload={onFileUpload}
        />
        <div className="mb-3">
          <label htmlFor={`flex-image2-alt-${section.id}`}>Alt Text (Image 2)</label>
          <Input
            id={`flex-image2-alt-${section.id}`}
            type="text"
            value={section.image2.alt}
            onChange={(e) => handleImageChange('image2', 'alt', e.target.value)}
            required
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Descriptive text for accessibility.</p>
        </div>
        <div className="mb-3">
          <label htmlFor={`flex-image2-title-${section.id}`}>Title (Image 2 - Optional)</label>
          <Input
            id={`flex-image2-title-${section.id}`}
            type="text"
            value={section.image2.title || ''}
            onChange={(e) => handleImageChange('image2', 'title', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor={`flex-image2-subtitle-${section.id}`}>Subtitle (Image 2 - Optional)</label>
          <Textarea
            id={`flex-image2-subtitle-${section.id}`}
            value={section.image2.subtitle || ''}
            onChange={(e) => handleImageChange('image2', 'subtitle', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default TwoImageFlexSectionEditor;