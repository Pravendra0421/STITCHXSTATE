'use client';
import React from 'react';
import { Look } from '@/core/entities/HomePage.entity';
import ImageUploadPreview from './ImageUploadPreview';
import { Input } from '@/components/ui/input';
import { TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline'; // Assuming these are needed for Look (if it were a list)
import { Button } from '@/components/ui/button';

interface LookSectionEditorProps {
  section: Look; // Note: 'Look' is a single item, not a section type 'look'
  onSectionChange: (newSection: Look) => void;
  onFileUpload: (file: File) => Promise<string>;
}

const LookSectionEditor = ({
  section,
  onSectionChange,
  onFileUpload,
}: LookSectionEditorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onSectionChange({ ...section, [name]: value });
  };

  const handleImageUrlChange = (url: string) => {
    onSectionChange({ ...section, imageUrl: url });
  };

  return (
    <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Featured Look Settings</h3>

      <ImageUploadPreview
        label="Image URL"
        imageUrl={section.imageUrl}
        onImageUrlChange={handleImageUrlChange}
        onFileUpload={onFileUpload}
      />
      <div>
        <label htmlFor={`look-alt-${section.id}`}>Alt Text</label>
        <Input
          id={`look-alt-${section.id}`}
          type="text"
          name="imageAlt" // Match the entity field name
          value={section.imageAlt}
          onChange={handleChange}
          required
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Descriptive text for accessibility.</p>
      </div>
      <div>
        <label htmlFor={`look-title-${section.id}`}>Title</label>
        <Input
          id={`look-title-${section.id}`}
          type="text"
          name="title" // Match the entity field name
          value={section.title}
          onChange={handleChange}
          required
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">The title for this featured look.</p>
      </div>
    </div>
  );
};

export default LookSectionEditor;