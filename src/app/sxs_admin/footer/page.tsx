'use client'
import { FooterEntity,FooterSection,NavLink,socialIcon } from "@/core/entities/Footer.entity"
import { FooterSectionUsecase } from "@/core/usecases/FooterSection.usecase"
import { FooterSectionApiRepository } from "@/infrastructure/frontend/repositories/FooterSection.api"
import { useState,useEffect } from "react"

const footerRepository = new FooterSectionApiRepository();
const footerUseCase = new FooterSectionUsecase(footerRepository);

const defaultSection:FooterEntity={
    description:'',
    category:[],
    season:[],
    about:[],
    socialIcons:[
        { iconName: 'facebook', url: '' },
        { iconName: 'twitter', url: '' },
        {  iconName: 'instagram', url: '' }
    ]
}
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
const FooterSectionPage=()=>{
    const [isloading,setLoading]=useState<boolean>(true);
    const [footerData,setFooterData]=useState<FooterSection |null>(null);
    const [ error,setError]=useState<string |null>(null);
    const [successMessage,setSuccessMessage]=useState<string |null>(null);
    const [save,setSave]=useState(false);

    const fetchFooterData = async()=>{
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const data = await footerUseCase.getFooter();
            if (!data || !data.sections || data.sections.length === 0) {
                setFooterData({ id: '', sections: [defaultSection], createdAt: new Date(), updatedAt: new Date() });
            }else{
                const updateSections = data.sections.map(section=>({
                    ...section,
                    socialIcons: ensureDefaultSocialIcons(section.socialIcons)
                }))
                setFooterData({...data,sections:updateSections});
            }
        } catch (err:any) {
            console.error("Error fetching header data:", err);
            setError(`Failed to fetch header data: ${err.message || 'Unknown error'}`);
        }finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchFooterData();
    },[]);

    const handleAddcategory=(sectionIndex:number)=>{
        const updatedSections=[...(footerData?.sections || [])];
        if(updatedSections[sectionIndex]){
            updatedSections[sectionIndex].category.push({label:'',url:''});
            setFooterData({...footerData!,sections:updatedSections});
        }
    }
    const handleAddSeason=(sectionIndex:number)=>{
        const updatedSections=[...(footerData?.sections || [])];
        if(updatedSections[sectionIndex]){
            updatedSections[sectionIndex].season.push({label:'',url:''});
            setFooterData({...footerData!,sections:updatedSections});
        }
    }
    const handleAddAbout=(sectionIndex:number)=>{
        const updatedSections=[...(footerData?.sections || [])];
        if(updatedSections[sectionIndex]){
            updatedSections[sectionIndex].about.push({label:'',url:''});
            setFooterData({...footerData!,sections:updatedSections});
        }
    }
    
    const handleRemoveCategory=(sectionIndex:number,linkIndex:number)=>{
        const updatedSections=[...(footerData?.sections || [])];
        if(updatedSections[sectionIndex]){
            updatedSections[sectionIndex].category.splice(linkIndex,1);
            setFooterData({...footerData!,sections:updatedSections});
        }
    }
    const handleRemoveSeason=(sectionIndex:number,linkIndex:number)=>{
        const updatedSections=[...(footerData?.sections || [])];
        if(updatedSections[sectionIndex]){
            updatedSections[sectionIndex].season.splice(linkIndex,1);
            setFooterData({...footerData!,sections:updatedSections});
        }
    }
    const handleRemoveAbout=(sectionIndex:number,linkIndex:number)=>{
        const updatedSections=[...(footerData?.sections || [])];
        if(updatedSections[sectionIndex]){
            updatedSections[sectionIndex].about.splice(linkIndex,1);
            setFooterData({...footerData!,sections:updatedSections});
        }
    }
     const handleSocialIconChange = (
      sectionIndex: number,
      iconIndex: number,
      field: keyof socialIcon,
      value: string
    ) => {
      const updatedSections = [...(footerData?.sections || [])];
      updatedSections[sectionIndex].socialIcons[iconIndex][field] = value;
      setFooterData({ ...footerData!, sections: updatedSections });
    };

    const handleCategoryChange=(
        sectionIndex:number,
        linkIndex:number,
        field: keyof NavLink,
        value:string
    )=>{
        const updatedSections=[...(footerData?.sections || [])];
        if(updatedSections[sectionIndex]){
            updatedSections[sectionIndex].category[linkIndex][field]=value;
            setFooterData({...footerData!,sections:updatedSections});
        }
    }
    const handleSeasonChange=(
        sectionIndex:number,
        linkIndex:number,
        field: keyof NavLink,
        value:string
    )=>{
        const updatedSections=[...(footerData?.sections || [])];
        if(updatedSections[sectionIndex]){
            updatedSections[sectionIndex].season[linkIndex][field]=value;
            setFooterData({...footerData!,sections:updatedSections});
        }
    }
    const handleAboutChange=(
        sectionIndex:number,
        linkIndex:number,
        field: keyof NavLink,
        value:string
    )=>{
        const updatedSections=[...(footerData?.sections || [])];
        if(updatedSections[sectionIndex]){
            updatedSections[sectionIndex].about[linkIndex][field]=value;
            setFooterData({...footerData!,sections:updatedSections});
        }
    }
    const handleSave=async()=>{
        if(!footerData) return;
        setSave(true);
        setError(null);
        setSuccessMessage(null)
        try {
            await footerUseCase.updateFooter({sections:footerData.sections});
            setSuccessMessage('footer updated successfully');
        } catch (err) {
            console.error(err);
            setError(' Something went wrong while saving.'); 
        }finally{
            setSave(false)
        }
    }
    if (isloading) return <p className="p-6">Loading...</p>;
    if (!footerData) return <p className="p-6 text-red-500">No header data found</p>;
    return(
        <div className="p-6 w-full mx-auto bg-white">
            <h2 className="text-2xl font-bold mb-4">Footer Management</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
            {footerData.sections.map((section,sectionIndex)=>(
                <div key={sectionIndex} className="mb-10 border p-4 rounded shadow">
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        value={section.description}
                        onChange={(e) => {
                        const updated = [...footerData.sections];
                        updated[sectionIndex].description = e.target.value;
                        setFooterData({ ...footerData, sections: updated });
                        }}
                        className="border p-2 w-full mb-4"
                    />
                    <h4 className="font-semibold mb-2">category section</h4>
                    {section.category.map((link,linkIndex)=>(
                        <div key={linkIndex} className="flex items-center gap-2 mb-2">
                    <input
                        type="text"
                        value={link.label}
                        placeholder="Label"
                        onChange={(e) => handleCategoryChange(sectionIndex, linkIndex, 'label', e.target.value)}
                        className="border p-1 w-[45%]"
                    />
                    <input
                        type="text"
                        value={link.url}
                        placeholder="URL"
                        onChange={(e) => handleCategoryChange(sectionIndex, linkIndex, 'url', e.target.value)}
                        className="border p-1 w-[45%]"
                    />
                    <button
                        onClick={() => handleRemoveCategory(sectionIndex, linkIndex)}
                        className="text-red-600 font-bold"
                    >✕</button>
                    </div>
                    ))}
                    <button
                        onClick={() => handleAddcategory(sectionIndex)}
                        className="mt-2 bg-gray-200 px-3 py-1 rounded"
                    >➕ Add</button>
                    <h4 className="font-semibold mb-2">Season</h4>
                    {section.season.map((link,linkIndex)=>(
                        <div key={linkIndex} className="flex items-center gap-2 mb-2">
                    <input
                        type="text"
                        value={link.label}
                        placeholder="Label"
                        onChange={(e) => handleSeasonChange(sectionIndex, linkIndex, 'label', e.target.value)}
                        className="border p-1 w-[45%]"
                    />
                    <input
                        type="text"
                        value={link.url}
                        placeholder="URL"
                        onChange={(e) => handleSeasonChange(sectionIndex, linkIndex, 'url', e.target.value)}
                        className="border p-1 w-[45%]"
                    />
                    <button
                        onClick={() => handleRemoveSeason(sectionIndex, linkIndex)}
                        className="text-red-600 font-bold"
                    >✕</button>
                    </div>
                    ))}
                    <button
                        onClick={() => handleAddSeason(sectionIndex)}
                        className="mt-2 bg-gray-200 px-3 py-1 rounded"
                    >➕ Add</button>
                    <h4 className="font-semibold mb-2">about section</h4>
                    {section.about.map((link,linkIndex)=>(
                        <div key={linkIndex} className="flex items-center gap-2 mb-2">
                    <input
                        type="text"
                        value={link.label}
                        placeholder="Label"
                        onChange={(e) => handleAboutChange(sectionIndex, linkIndex, 'label', e.target.value)}
                        className="border p-1 w-[45%]"
                    />
                    <input
                        type="text"
                        value={link.url}
                        placeholder="URL"
                        onChange={(e) => handleAboutChange(sectionIndex, linkIndex, 'url', e.target.value)}
                        className="border p-1 w-[45%]"
                    />
                    <button
                        onClick={() => handleRemoveAbout(sectionIndex, linkIndex)}
                        className="text-red-600 font-bold"
                    >✕</button>
                    </div>
                    ))}
                    <button
                        onClick={() => handleAddAbout(sectionIndex)}
                        className="mt-2 bg-gray-200 px-3 py-1 rounded"
                    >➕ Add</button>

                    <h4 className="mt-6 font-semibold mb-2">Social Icons</h4>
                    {section.socialIcons.map((icon, iconIndex) => (
                        <div key={iconIndex} className="flex gap-2 mb-2">
                            <input
                            type="text"
                            value={icon.iconName}
                            placeholder="Icon Name"
                            readOnly
                            className="border p-1 w-1/3 bg-gray-100"
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
    )
    
}
export default FooterSectionPage;