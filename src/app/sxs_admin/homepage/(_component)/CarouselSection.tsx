'use client'
import React from "react"
import { CarouselSection,CarouselImage } from "@/core/entities/HomePage.entity"
import ImageUplaodPreview from "./ImageUploadPreview"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, MinusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
interface CarouselSectionProps{
    section:CarouselSection;
    onSectionChange:(newSection:CarouselSection)=>void;
    onFileUpload:(file:File)=>Promise<string>
}
const CarouselSectionEditor=({
     section,
  onSectionChange,
  onFileUpload,
}:CarouselSectionProps)=>{
    const handleImageChange =(index:number,field:keyof CarouselImage,value:string)=>{
        const updatedImages = section.images.map((img,i)=>
            i===index?{...img,[field]:value}:img
        );
        onSectionChange({...section,images:updatedImages});
    };

    // adds a new empty image object to the carousel
    const handleAddImage = () => {
    onSectionChange({
      ...section,
      images: [...section.images, { id: uuidv4(), imageUrl: '', alt: '' }], // New image with unique ID
    });
  };
  const handleRemoveImage = (index: number) => {
    const updatedImages = section.images.filter((_, i) => i !== index);
    onSectionChange({ ...section, images: updatedImages });
  };
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onSectionChange({ ...section, intervalMs: isNaN(value) ? undefined : value });
  };
  return(
    <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
         <h3 className="text-xl font-semibold text-gray-800 mb-4">Carousel Settings</h3>
         <div>
        <label htmlFor={`carousel-interval-${section.id}`}>Slide Interval (milliseconds)</label>
        <Input
          id={`carousel-interval-${section.id}`}
          type="number"
          value={section.intervalMs || ''}
          onChange={handleIntervalChange}
          placeholder="5000"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Time each slide is visible before automatically transitioning.</p>
      </div>
      <h4 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Carousel Images</h4>
      {section.images.map((image,index)=>(
        <div key={image.id} className="relative p-4 border border-gray-300 rounded-md bg-white shadow-sm mb-4">
            <h5 className="text-md font-medium text-indigo-700 mb-3">Image #{index + 1}</h5>
            <Button
            type="button"
            variant="ghost" // Use ghost variant if available, otherwise adjust style
            size="sm"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full"
            title="Remove this image"
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
          <ImageUplaodPreview
          label="Image Url"
          imageUrl={image.imageUrl}
          onImageUrlChange={(url)=>handleImageChange(index, 'imageUrl',url)}
          onFileUpload={onFileUpload}
          />

          {/* alt Text Input */}
          <div className="mb-3">
            <label htmlFor={`carousel-alt-${section.id}-${index}`}>ALt Text</label>
            <Input
              id={`carousel-alt-${section.id}-${index}`}
              type="text"
              value={image.alt}
              onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Descriptive text for accessibility (screen readers).</p>

          </div>
        </div>
      ))}
       {/* Button to add more images */}
      <Button
        type="button"
        onClick={handleAddImage}
        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
      >
        <PlusCircleIcon className="h-5 w-5 mr-2" /> Add Another Image
      </Button>
    </div>
  )
}
export default CarouselSectionEditor