'use client'
import React,{useState} from "react"
interface ImageUplaodProps{
    label:string;
    imageUrl:string;
    onImageUrlChange:(url:string)=>void;
    onFileUpload?:(file:File)=>Promise<string>;
    disabled?:boolean;
}
const ImageUplaodPreview=({
  label,
  imageUrl,
  onImageUrlChange,
  onFileUpload,
  disabled = false,
}: ImageUplaodProps) => {

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null); 

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>)=>{
        const file = event.target.files?.[0];
        if(file && onFileUpload){
            setIsUploading(true);
            setUploadError(null);
            try{
                const newUrl = await onFileUpload(file);
                onImageUrlChange(newUrl);
            }catch (error) {
                console.error("Image upload failed:", error);
                setUploadError("Failed to upload image. Please try again.");
            } finally {
                setIsUploading(false); 
                if (event.target) event.target.value = '';
            }
        }
    };
    const handleClearImage =()=>{
        onImageUrlChange('');
    };
    return(
        <div className="mb-4 p-3 border border-gray-300 rounded-md bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            {/* image preview Area */}
            <div className="mb-3 w-full h-32 flex items-center justify-center bg-gray-100 border border-dashed border-gray-400 rounded-md overflow-hidden">
                {
                    imageUrl?(
                    <img
                        src={imageUrl}
                        alt="preview"
                        className="max-w-full max-h-full object-contain rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150x100/eeeeee/aaaaaa?text=Image+Error'; }}
                    />)
                    :
                    (<span className="text-gray-500 text-sm">No Image Selected</span>)
                }
            </div>
            {/* URL Input Field */}
            <input
                type="text"
                value={imageUrl}
                onChange={(e) => onImageUrlChange(e.target.value)}
                placeholder="Enter image URL or upload"
                disabled={disabled || isUploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-3"
            />

            {/* Upload and Clear Buttons */}
            <div className="flex flex-wrap gap-2 justify-end">
                {onFileUpload && (
                <label
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer text-sm font-medium hover:bg-blue-700 transition-colors duration-200 ${
                    disabled || isUploading ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                    <input
                    type="file"
                    accept="image/*" // Restrict to image files
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Hide the actual file input
                    disabled={disabled || isUploading}
                    />
                </label>
                )}
                {imageUrl && (
                <button
                    onClick={handleClearImage}
                    disabled={disabled || isUploading}
                    className={`px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200 ${
                    disabled || isUploading ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                >
                    Clear Image
                </button>
                )}
            </div>
            {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
        </div>
    )

}
export default ImageUplaodPreview;