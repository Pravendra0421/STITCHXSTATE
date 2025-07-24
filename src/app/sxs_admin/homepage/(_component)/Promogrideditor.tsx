'use client';
import React from 'react';
import { PromoGrid, Promo } from '@/core/entities/HomePage.entity';
import ImageUploadPreview from './ImageUploadPreview';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // For description/subtitle
import { PlusCircleIcon, MinusCircleIcon, TrashIcon } from '@heroicons/react/24/outline'; // If needed for dynamic promos, though structure is fixed for promoLeft/Right

interface PromoGridEditorProps {
  section: PromoGrid;
  onSectionChange: (newSection: PromoGrid) => void;
  onFileUpload: (file: File) => Promise<string>;
}

const PromoGridEditor = ({
  section,
  onSectionChange,
  onFileUpload,
}: PromoGridEditorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onSectionChange({ ...section, [name]: value });
  };

  const handlePromoChange = (
    promoKey: 'promoLeft' | 'promoRight',
    field: keyof Promo,
    value: string
  ) => {
    onSectionChange({
      ...section,
      [promoKey]: {
        ...section[promoKey],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Promo Grid Settings</h3>

      {/* Main Promo Grid Fields */}
      <ImageUploadPreview
        label="Background Image URL (for grid)"
        imageUrl={section.imageUrl}
        onImageUrlChange={(url) => onSectionChange({ ...section, imageUrl: url })}
        onFileUpload={onFileUpload}
      />
      <div>
        <label htmlFor={`promo-grid-pretitle-${section.id}`}>Pre-title (Optional)</label>
        <Input
          id={`promo-grid-pretitle-${section.id}`}
          type="text"
          name="pretitle"
          value={section.pretitle || ''}
          onChange={handleChange}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Text above the main title.</p>
      </div>
      <div>
        <label htmlFor={`promo-grid-title-${section.id}`}>Title (Optional)</label>
        <Input
          id={`promo-grid-title-${section.id}`}
          type="text"
          name="title"
          value={section.title || ''}
          onChange={handleChange}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Main title for the promo grid.</p>
      </div>
      <div>
        <label htmlFor={`promo-grid-subtitle-${section.id}`}>Subtitle (Optional)</label>
        <Input
          id={`promo-grid-subtitle-${section.id}`}
          type="text"
          name="subtitle"
          value={section.subtitle || ''}
          onChange={handleChange}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Secondary title or brief statement.</p>
      </div>
      <div>
        <label htmlFor={`promo-grid-description-${section.id}`}>Description (Optional)</label>
        <Textarea
          id={`promo-grid-description-${section.id}`}
          name="description"
          value={section.description || ''}
          onChange={handleChange}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Longer descriptive text for the section.</p>
      </div>

      {/* Promo Left Editor */}
      <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm mt-6">
        <h4 className="text-lg font-semibold text-indigo-700 mb-3">Left Promo</h4>
        <div>
          <label htmlFor={`promo-left-percentage-${section.id}`}>Percentage Text</label>
          <Input
            id={`promo-left-percentage-${section.id}`}
            type="text"
            value={section.promoLeft.percentageText}
            onChange={(e) => handlePromoChange('promoLeft', 'percentageText', e.target.value)}
            required
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">e.g., &quot;50% OFF&quot; or &quot;SAVE $20&quot;</p>
        </div>
        <ImageUploadPreview
          label="Image 1 URL (Left Promo)"
          imageUrl={section.promoLeft.image1Url}
          onImageUrlChange={(url) => handlePromoChange('promoLeft', 'image1Url', url)}
          onFileUpload={onFileUpload}
        />
        <div>
          <label htmlFor={`promo-left-image1-alt-${section.id}`}>Image 1 Alt Text (Left Promo)</label>
          <Input
            id={`promo-left-image1-alt-${section.id}`}
            type="text"
            value={section.promoLeft.image1Alt}
            onChange={(e) => handlePromoChange('promoLeft', 'image1Alt', e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <ImageUploadPreview
          label="Image 2 URL (Left Promo)"
          imageUrl={section.promoLeft.image2Url}
          onImageUrlChange={(url) => handlePromoChange('promoLeft', 'image2Url', url)}
          onFileUpload={onFileUpload}
        />
        <div>
          <label htmlFor={`promo-left-image2-alt-${section.id}`}>Image 2 Alt Text (Left Promo)</label>
          <Input
            id={`promo-left-image2-alt-${section.id}`}
            type="text"
            value={section.promoLeft.image2Alt}
            onChange={(e) => handlePromoChange('promoLeft', 'image2Alt', e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor={`promo-left-cta-${section.id}`}>CTA Text (Left Promo - Optional)</label>
          <Input
            id={`promo-left-cta-${section.id}`}
            type="text"
            value={section.promoLeft.ctaText || ''}
            onChange={(e) => handlePromoChange('promoLeft', 'ctaText', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Call to Action text (e.g., &quot;Shop Now&quot;)</p>
        </div>
      </div>

      {/* Promo Right Editor */}
      <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm mt-6">
        <h4 className="text-lg font-semibold text-indigo-700 mb-3">Right Promo</h4>
        <div>
          <label htmlFor={`promo-right-percentage-${section.id}`}>Percentage Text</label>
          <Input
            id={`promo-right-percentage-${section.id}`}
            type="text"
            value={section.promoRight.percentageText}
            onChange={(e) => handlePromoChange('promoRight', 'percentageText', e.target.value)}
            required
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">e.g., &quot;30% OFF&quot; or &quot;NEW ARRIVALS&quot;</p>
        </div>
        <ImageUploadPreview
          label="Image 1 URL (Right Promo)"
          imageUrl={section.promoRight.image1Url}
          onImageUrlChange={(url) => handlePromoChange('promoRight', 'image1Url', url)}
          onFileUpload={onFileUpload}
        />
        <div>
          <label htmlFor={`promo-right-image1-alt-${section.id}`}>Image 1 Alt Text (Right Promo)</label>
          <Input
            id={`promo-right-image1-alt-${section.id}`}
            type="text"
            value={section.promoRight.image1Alt}
            onChange={(e) => handlePromoChange('promoRight', 'image1Alt', e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <ImageUploadPreview
          label="Image 2 URL (Right Promo)"
          imageUrl={section.promoRight.image2Url}
          onImageUrlChange={(url) => handlePromoChange('promoRight', 'image2Url', url)}
          onFileUpload={onFileUpload}
        />
        <div>
          <label htmlFor={`promo-right-image2-alt-${section.id}`}>Image 2 Alt Text (Right Promo)</label>
          <Input
            id={`promo-right-image2-alt-${section.id}`}
            type="text"
            value={section.promoRight.image2Alt}
            onChange={(e) => handlePromoChange('promoRight', 'image2Alt', e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor={`promo-right-cta-${section.id}`}>CTA Text (Right Promo - Optional)</label>
          <Input
            id={`promo-right-cta-${section.id}`}
            type="text"
            value={section.promoRight.ctaText || ''}
            onChange={(e) => handlePromoChange('promoRight', 'ctaText', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Call to Action text (e.g., &quot;Explore More&quot;)</p>
        </div>
      </div>
    </div>
  );
};

export default PromoGridEditor;