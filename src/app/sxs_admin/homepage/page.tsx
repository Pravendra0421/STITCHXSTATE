'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
// Correctly import the entities and define the union type explicitly for clarity
import { HomepageEntity, CarouselSection, TimerSection,TwoImageFlexSection,PromoGrid,Look,BlogPost } from '@/core/entities/HomePage.entity';
import { HomePageUseCases } from '@/core/usecases/HomePage.usecase';
import { HomePageApiRepository } from '@/infrastructure/frontend/repositories/HomePage.api';
import { ImageApiRepository } from '@/infrastructure/frontend/repositories/ImageRepository.api';

// UI Components
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for new sections/items

// Import only the section editor components that have been created
import CarouselSectionEditor from './(_component)/CarouselSection';
import TimerSectionEditor from './(_component)/TimerSection';
import TwoImageFlexSectionEditor from './(_component)/TwoImageFlexSection';
import BlogPostSectionEditor from './(_component)/BlogPostSectionEditor';
import PromoGridEditor from './(_component)/Promogrideditor';
import LookSectionEditor from './(_component)/LookSectionEditor';

// --- Type Definitions & Guards ---
// Explicitly define HomePageSection as a union of the sections this component can handle.
type HomePageSection = CarouselSection | TimerSection |TwoImageFlexSection |PromoGrid |Look|BlogPost;

// An array of the section types that have a corresponding editor component.
// Using 'BlogPost' as per your provided code
const KNOWN_SECTION_TYPES: ReadonlyArray<string> = ['carousel', 'timer','two-image-flex','promo-grid','look','BlogPost'];

// Type guard to check if a section is one of the known, editable types.
// This helps TypeScript narrow the type from the broader entity type to our local HomePageSection.
function isKnownSection(section: any): section is HomePageSection {
  return KNOWN_SECTION_TYPES.includes(section?.type);
}


// --- Dependency Injection Setup ---
const homepageRepository = new HomePageApiRepository();
const imageApiRepository = new ImageApiRepository();
const homepageUseCases = new HomePageUseCases(homepageRepository);

// --- Component Map ---
// Map only the section types that have corresponding editor components.
// Using 'BlogPost' as per your provided code
const SECTION_EDITORS: Record<HomePageSection['type'], React.FC<any>> = {
  carousel: CarouselSectionEditor,
  timer: TimerSectionEditor,
  'two-image-flex':TwoImageFlexSectionEditor,
  'promo-grid':PromoGridEditor,
  look:LookSectionEditor,
  'BlogPost':BlogPostSectionEditor
};

const HomePageAdminPage: React.FC = () => {
  const [homepageContent, setHomepageContent] = useState<HomepageEntity | null>(null);
  const [seoTitle, setSeoTitle] = useState<string>('');
  const [seoDescription, setSeoDescription] = useState<string>('');

  // --- UI State Management ---
  const [loading, setLoading] = useState(true);
  const [initialFetchError, setInitialFetchError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<HomePageSection | null>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchHomepage = async () => {
      setLoading(true);
      setInitialFetchError(null);
      try {
        const data = await homepageUseCases.getHomepage();
        setHomepageContent(data);
        setSeoTitle(data?.seoTitle || '');
        setSeoDescription(data?.seoDescription || '');
      } catch (err) {
        setInitialFetchError("Failed to load homepage content. Please try again.");
        console.error("Initial fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []); // Empty dependency array ensures this runs once on mount

  // --- State Update Callbacks ---
  const handleSectionChange = useCallback((updatedSection: HomePageSection) => {
    setHomepageContent((prev) => {
      if (!prev) return null;
      // The sections array in state can contain unknown types, so we cast to 'any' for the map.
      const updatedSections = (prev.sections as any[]).map((sec) =>
        sec.id === updatedSection.id ? updatedSection : sec
      );
      return { ...prev, sections: updatedSections };
    });
    setEditingSection(updatedSection); // Keep the editor in sync
  }, []);

  const handleAddSection = useCallback((type: HomePageSection['type']) => {
    if (!homepageContent) return;

    // Check if a section of this type already exists in the homepage content
    const existingSection = homepageContent.sections.find(
      (sec): sec is HomePageSection => isKnownSection(sec) && sec.type === type
    );

    if (existingSection) {
      // If a section of this type exists, navigate to it and provide feedback
      setEditingSection(existingSection);
      setShowAddSectionModal(false); // Close the modal
      // Format the type for display (e.g., "carousel" -> "Carousel", "two-image-flex" -> "Two Image Flex", "BlogPost" -> "Blog Post")
      const formattedType = type.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      setSaveMessage(`${formattedType} section already exists. Opening it for editing.`);
      setTimeout(() => setSaveMessage(null), 3000); // Clear message after 3 seconds
      return; // Stop function execution
    }

    // If no existing section of this type, proceed to add a new one
    const newId = uuidv4();
    let newSection: HomePageSection;

    switch (type) {
      case 'carousel':
        newSection = {
          id: newId,
          type: 'carousel',
          images: [{ id: uuidv4(), imageUrl: 'https://placehold.co/1200x500?text=New+Carousel+Image', alt: 'New Carousel Image' }], // Added ctaText and ctaLink for completeness based on typical usage
          intervalMs: 5000,
        };
        break;
      case 'timer':
        newSection = {
          id: newId,
          type: 'timer',
          imageUrl: 'https://placehold.co/1200x400?text=New+Timer+Banner',
          alt: 'New Timer Banner',
          title: 'New Dynamic Sale!',
          subTitle: 'This is a great opportunity!',
          countdownTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      case 'two-image-flex':
        newSection = {
          id: newId,
          type: 'two-image-flex',
          image1: { id: uuidv4(), url: 'https://placehold.co/600x300?text=Flex+Image+1', alt: 'Flex Banner 1', title: 'Left Banner', subtitle: 'Great Deals' }, 
          image2: { id: uuidv4(), url: 'https://placehold.co/600x300?text=Flex+Image+2', alt: 'Flex Banner 2', title: 'Right Banner', subtitle: 'New Arrivals' }, 
        };
        break;
      case 'promo-grid':
        newSection = {
            id: newId,
            type: 'promo-grid',
            pretitle: 'Featured',
            imageUrl: 'https://placehold.co/1200x400?text=Promo+Grid+Banner',
            title: 'Big Savings!',
            subtitle: 'Limited time offers',
            description: 'Check out our top deals across various categories.',
            promoLeft: {
                id: uuidv4(),
                percentageText: '30% OFF',
                image1Url: 'https://placehold.co/200x200?text=Promo+Left+Img1',
                image1Alt: 'Promo Left Img1',
                image2Url: 'https://placehold.co/200x200?text=Promo+Left+Img2',
                image2Alt: 'Promo Left Img2',
                ctaText: 'Shop Now'
            },
            promoRight: {
                id: uuidv4(),
                percentageText: 'BUY 1 GET 1',
                image1Url: 'https://placehold.co/200x200?text=Promo+Right+Img1',
                image1Alt: 'Promo Right Img1',
                image2Url: 'https://placehold.co/200x200?text=Promo+Right+Img2',
                image2Alt: 'Promo Right Img2',
                ctaText: 'See Offer'
            }
        };
        break;
      case 'look':
        newSection = {
            id: newId,
            type: 'look',
            title: 'Your Perfect Look',
            imageUrl: 'https://placehold.co/800x600?text=Lookbook+Image',
            imageAlt: 'Model showcasing new collection'
        };
        break;
      case 'BlogPost': // Keeping 'BlogPost' as per your original code
        newSection = {
            id: newId,
            type: 'BlogPost', // Keeping 'BlogPost' as per your original code
            title: 'Latest Blog Posts',
            post1: {
                id: uuidv4(),
                imageUrl: 'https://placehold.co/300x200?text=Blog+Post+1',
                imageAlt: 'Blog Post 1',
                title: 'Fashion Trends 2025',
                description: 'Explore the hottest styles for the upcoming year.'
            },
            post2: {
                id: uuidv4(),
                imageUrl: 'https://placehold.co/300x200?text=Blog+Post+2',
                imageAlt: 'Blog Post 2',
                title: 'Sustainable Shopping Guide',
                description: 'Tips for a more eco-friendly wardrobe.'
            },
            post3: {
                id: uuidv4(),
                imageUrl: 'https://placehold.co/300x200?text=Blog+Post+3',
                imageAlt: 'Blog Post 3',
                title: 'How to Style Denim',
                description: 'Classic and new ways to wear your favorite jeans.'
            }
        };
        break;
      default:
        console.warn('Attempted to add unknown section type:', type);
        return;
    }
    setHomepageContent((prev) => {
      if (!prev) return null;
      return { ...prev, sections: [...prev.sections, newSection] };
    });
    setShowAddSectionModal(false);
    setEditingSection(newSection); // Open the editor for the new section
  }, [homepageContent]);


  // Updated reorder logic to work with IDs, making it independent of the filtered view
  const handleReorderSections = useCallback((draggedId: string, targetId: string) => {
    if (!homepageContent || draggedId === targetId) return;
    
    setHomepageContent((prev) => {
        if (!prev) return null;
        const sections = [...prev.sections];
        const draggedIndex = sections.findIndex(s => s.id === draggedId);
        const targetIndex = sections.findIndex(s => s.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return prev;

        const [draggedItem] = sections.splice(draggedIndex, 1);
        sections.splice(targetIndex, 0, draggedItem);
        
        return { ...prev, sections };
    });
  }, [homepageContent]);

  // --- API Interaction Handlers ---
  const handleSaveChanges = async () => {
    if (!homepageContent) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const updatedHomepage = await homepageUseCases.updateHomePage({ sections: homepageContent.sections, seoTitle, seoDescription });
      setHomepageContent(updatedHomepage);
      setSaveMessage("Homepage saved successfully!");
      setEditingSection(null); // Close editor on successful save
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveError(`Failed to save homepage: ${(err as Error).message}`);
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const imageUrlResponse = await imageApiRepository.upload(file);
      return imageUrlResponse.url;
    } catch (uploadError) {
      console.error('File upload service error:', uploadError);
      throw uploadError; // Re-throw for the child component's error handler
    }
  }, []);

  // --- Render Logic ---
  if (loading) return <div className="p-8 text-center text-lg text-gray-600">Loading Homepage Content...</div>;
  if (initialFetchError) return <div className="p-8 text-center text-lg text-red-600">Error: {initialFetchError}</div>;

  const RenderSectionEditor = editingSection ? SECTION_EDITORS[editingSection.type] : null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Manage Homepage Content</h1>

        {/* Global Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm mb-8 border border-gray-200">
          <Button
            onClick={() => setShowAddSectionModal(true)}
            className="bg-indigo-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-indigo-700 transition-colors duration-300 mb-4 md:mb-0"
          >
            <PlusCircleIcon className="h-6 w-6 mr-3" /> Add New Section
          </Button>
          <div className="flex gap-4">
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-green-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </div>

        {/* Save/Error Messages */}
        {saveError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{saveError}</div>}
        {saveMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{saveMessage}</div>}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: List of Sections */}
          <div className="lg:col-span-1 border border-gray-200 rounded-lg p-6 bg-gray-50 h-fit">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Homepage Sections</h2>
            <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-md p-2 bg-white">
              {homepageContent?.sections.filter(isKnownSection).length === 0 ? (
                <p className="text-center text-gray-500 py-10">No editable sections found.</p>
              ) : (
                homepageContent?.sections.filter(isKnownSection).map((section, index) => (
                  <div
                    key={section.id}
                    onClick={() => setEditingSection(section)}
                    className={`flex items-center justify-between p-3 mb-2 border rounded-md shadow-sm cursor-pointer transition-all duration-200 ${editingSection?.id === section.id ? 'bg-indigo-100 border-indigo-400' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                    draggable="true"
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', section.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleReorderSections(e.dataTransfer.getData('text/plain'), section.id);
                    }}
                  >
                    <div className="flex-grow flex items-center gap-3">
                      <span className="text-gray-500 cursor-grab">☰</span>
                      {/* Display user-friendly name (e.g., "Carousel", "Two Image Flex", "Blog Post") */}
                      <span className="font-semibold text-md text-gray-800">{index + 1}. {section.type.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    </div>
                    
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Editor for the selected section */}
          <div className="lg:col-span-2">
            {editingSection && RenderSectionEditor ? (
              <RenderSectionEditor
                key={editingSection.id}
                section={editingSection}
                onSectionChange={handleSectionChange}
                onFileUpload={handleFileUpload}
              />
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-10">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-700">Select a section to edit</h3>
                  <p className="text-gray-500 mt-2">Choose a section from the left panel to begin customizing its content.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Adding a New Section */}
        {showAddSectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose a Section Type to Add</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Map over KNOWN_SECTION_TYPES to dynamically generate buttons */}
                {KNOWN_SECTION_TYPES.map((type) => (
                  <Button
                    key={type}
                    onClick={() => handleAddSection(type as HomePageSection['type'])}
                    className="p-6 text-lg justify-center bg-gray-200 text-gray-800 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    {/* Display user-friendly name (e.g., "Carousel", "Two Image Flex", "Blog Post") */}
                    {type.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Button>
                ))}
              </div>
              <Button onClick={() => setShowAddSectionModal(false)} className="mt-8 w-full bg-gray-700 text-white hover:bg-gray-800">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
          <input
            type="text"
            id="seoTitle"
            name="seoTitle"
            value={seoTitle}
            onChange={e => setSeoTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="SEO Title for the homepage"
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
            placeholder="SEO Description for the homepage"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default HomePageAdminPage;