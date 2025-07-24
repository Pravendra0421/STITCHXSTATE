'use client'

import { HeaderSection, HeaderEntity, NavLink, socialIcon } from "@/core/entities/Header.entity";
import { HeaderSectionUseCases } from "@/core/usecases/HeaderSection.usecase";
import { HeaderSectionApiRepository } from "@/infrastructure/frontend/repositories/HeaderSection.api";
import { useEffect, useState } from "react";

const HeaderSectionApi = new HeaderSectionApiRepository();
const headerUseCases = new HeaderSectionUseCases(HeaderSectionApi);

const defaultSection: HeaderEntity = {
  logo: '',
  mainNavlinks: [],
  mainNav: {
    shop: { label: '', url: '' },
    season: { label: '', url: '' },
    journal: { label: '', url: '' },
    themeFeatures: { label: '', url: '' }
  },
  socialIcons: [
  { iconName: 'facebook', url: '' },
  { iconName: 'twitter', url: '' },
  {  iconName: 'instagram', url: '' }
]
};
const ensureDefaultSocialIcons = (icons: socialIcon[] = []): socialIcon[] => {
  const iconMap: Record<string, socialIcon> = {};
  icons.forEach(icon => {
    iconMap[icon.iconName] = icon;
  });

  ['facebook', 'twitter', 'instagram'].forEach(name => {
    if (!iconMap[name]) {
      iconMap[name] = { iconName: name, url: '' };
    }
  });

  return ['facebook', 'twitter', 'instagram'].map(name => iconMap[name]);
};
const HeaderSectionPage = () => {
  const [isloading, setLoading] = useState<boolean>(true);
  const [headerData, setHeaderData] = useState<HeaderSection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [save, SetSave] = useState(false);

  const fetchHeaderData = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await headerUseCases.getHeader();
      if (!data || !data.sections || data.sections.length === 0) {
        setHeaderData({ id: '', sections: [defaultSection], createdAt: new Date(), updatedAt: new Date() });
      } else {
        const updatedSections = data.sections.map(section => ({
        ...section,
        socialIcons: ensureDefaultSocialIcons(section.socialIcons)
      }));
        setHeaderData({ ...data, sections: updatedSections });
      }
    } catch (err: any) {
      console.error("Error fetching header data:", err);
      setError(`Failed to fetch header data: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeaderData();
  }, []);

  const handleAddNavLink = (sectionIndex: number) => {
    const updatedSections = [...(headerData?.sections || [])];
    if (updatedSections[sectionIndex]) {
      updatedSections[sectionIndex].mainNavlinks.push({ label: '', url: '' });
      setHeaderData({ ...headerData!, sections: updatedSections });
    }
  };

  const handleRemoveNavLink = (sectionIndex: number, linkIndex: number) => {
    const updatedSections = [...(headerData?.sections || [])];
    if (updatedSections[sectionIndex]) {
      updatedSections[sectionIndex].mainNavlinks.splice(linkIndex, 1);
      setHeaderData({ ...headerData!, sections: updatedSections });
    }
  };

  const handleNavLinkChange = (
    sectionIndex: number,
    linkIndex: number,
    field: keyof NavLink,
    value: string
  ) => {
    const updatedSections = [...(headerData?.sections || [])];
    if (updatedSections[sectionIndex]) {
      updatedSections[sectionIndex].mainNavlinks[linkIndex][field] = value;
      setHeaderData({ ...headerData!, sections: updatedSections });
    }
  };

  const handleMainNavChange = (
    sectionIndex: number,
    key: keyof HeaderEntity['mainNav'],
    field: keyof NavLink,
    value: string
  ) => {
    const updatedSections = [...(headerData?.sections || [])];
    if (updatedSections[sectionIndex]) {
      updatedSections[sectionIndex].mainNav[key][field] = value;
      setHeaderData({ ...headerData!, sections: updatedSections });
    }
  };
  const handleSocialIconChange = (
  sectionIndex: number,
  iconIndex: number,
  field: keyof socialIcon,
  value: string
) => {
  const updatedSections = [...(headerData?.sections || [])];
  updatedSections[sectionIndex].socialIcons[iconIndex][field] = value;
  setHeaderData({ ...headerData!, sections: updatedSections });
};

  const handleSave = async () => {
    if (!headerData) return;
    SetSave(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await headerUseCases.updateHeader({ sections: headerData.sections });
      setSuccessMessage('Header updated successfully!');        
    } catch (err) {
      console.error(err);
      setError(' Something went wrong while saving.');
    } finally {
      SetSave(false);
    }
  };

  if (isloading) return <p className="p-6">Loading...</p>;
  if (!headerData) return <p className="p-6 text-red-500">No header data found</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto w-full bg-white">
      <h2 className="text-2xl font-bold mb-4">Header Management</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      {headerData.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-10 border p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Section {sectionIndex + 1}</h3>

          <label className="block font-medium mb-1">Logo</label>
          <input
            type="text"
            value={section.logo}
            onChange={(e) => {
              const updated = [...headerData.sections];
              updated[sectionIndex].logo = e.target.value;
              setHeaderData({ ...headerData, sections: updated });
            }}
            className="border p-2 w-full mb-4"
          />

          

          <h4 className="font-semibold mb-2">Main Nav Links (Dynamic)</h4>
          {section.mainNavlinks.map((link, linkIndex) => (
            <div key={linkIndex} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={link.label}
                placeholder="Label"
                onChange={(e) => handleNavLinkChange(sectionIndex, linkIndex, 'label', e.target.value)}
                className="border p-1 w-[45%]"
              />
              <input
                type="text"
                value={link.url}
                placeholder="URL"
                onChange={(e) => handleNavLinkChange(sectionIndex, linkIndex, 'url', e.target.value)}
                className="border p-1 w-[45%]"
              />
              <button
                onClick={() => handleRemoveNavLink(sectionIndex, linkIndex)}
                className="text-red-600 font-bold"
              >✕</button>
            </div>
          ))}
          <button
            onClick={() => handleAddNavLink(sectionIndex)}
            className="mt-2 bg-gray-200 px-3 py-1 text-black rounded"
          >➕ Add Nav Link</button>

          <h4 className="mt-6 font-semibold mb-2">Main Navigation</h4>
          {Object.entries(section.mainNav).map(([key, nav]) => (
            <div key={key} className="mb-3">
              <label className="block font-medium capitalize">{key}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nav.label}
                  placeholder="Label"
                  onChange={(e) =>
                    handleMainNavChange(sectionIndex, key as keyof HeaderEntity['mainNav'], 'label', e.target.value)}
                  className="border p-1 w-1/2"
                />
                <input
                  type="text"
                  value={nav.url}
                  placeholder="URL"
                  onChange={(e) =>
                    handleMainNavChange(sectionIndex, key as keyof HeaderEntity['mainNav'], 'url', e.target.value)}
                  className="border p-1 w-1/2"
                />
              </div>
            </div>
          ))}
          <h4 className="mt-6 font-semibold mb-2">socialIcon</h4>
          <h4 className="mt-6 font-semibold mb-2">Social Icons</h4>
            {section.socialIcons.map((icon, iconIndex) => (
            <div key={iconIndex} className="flex gap-2 mb-2">
                <input
                type="text"
                value={icon.iconName}
                placeholder="Icon Name"
                readOnly
                className="border p-1 w-1/3 bg-gray-100 text-black"
                />
                <input
                type="text"
                value={icon.url}
                placeholder="URL"
                onChange={(e) =>
                    handleSocialIconChange(sectionIndex, iconIndex, 'url', e.target.value)
                }
                className="border p-1 w-2/3"
                />
            </div>
            ))}
        </div>
      ))}
      

      <button
        onClick={handleSave}
        disabled={save}
        className={`mt-8 px-4 py-2 rounded text-white ${
          save ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {save ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};
export default HeaderSectionPage;
