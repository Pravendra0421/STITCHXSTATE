'use client'
import React from "react"
import { TimerSection } from "@/core/entities/HomePage.entity"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ImageUplaodPreview from "./ImageUploadPreview"
interface TimeSectionProps{
    section:TimerSection;
    onSectionChange:(newSection:TimerSection)=>void;
    onFileUpload:(file:File)=>Promise<string>;
}

const TimerSectionEditor=({
    section,
  onSectionChange,
  onFileUpload,
}:TimeSectionProps)=>{
    const handleChange =(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        const {name,value} = e.target;
        onSectionChange({...section,[name]:value})
    };
    return (
        <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Countdown Timer Settings</h3>
            <ImageUplaodPreview
            label="Background Image URL"
            imageUrl={section.imageUrl}
            onImageUrlChange={(url) => onSectionChange({ ...section, imageUrl: url })}
            onFileUpload={onFileUpload}
            />

            <label htmlFor={`timer-alt-${section.id}`}>Alt Text</label>
                <Input
                id={`timer-alt-${section.id}`}
                type="text"
                name="alt"
                value={section.alt || ''}
                onChange={handleChange}
                required
                className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Descriptive text for accessibility.</p>
                {/* Main Title Input */}
                <div>
                    <label htmlFor={`timer-title-${section.id}`}>Main Title</label>
                    <Input
                    id={`timer-title-${section.id}`}
                    type="text"
                    name="title"
                    value={section.title || ''}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">The primary headline for the timer section.</p>
                </div>
                {/* Subtitle Input */}
                <div>
                    <label htmlFor={`timer-subTitle-${section.id}`}>Subtitle </label>
                    <Textarea
                    id={`timer-subTitle-${section.id}`}
                    name="subTitle"
                    value={section.subTitle || ''}
                    onChange={handleChange}
                    className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Secondary text or brief description.</p>
                </div>

                {/* Countdown To Date/Time Input */}
                <div>
                    <label htmlFor={`timer-countdownTo-${section.id}`}>Countdown End Date/Time</label>
                    <Input
                    id={`timer-countdownTo-${section.id}`}
                    type="datetime-local" // HTML5 input for date and time
                    name="countdownTo"
                    // Convert ISO string to format suitable for datetime-local input (YYYY-MM-DDTHH:mm)
                    value={section.countdownTo ? new Date(section.countdownTo).toISOString().slice(0, 16) : ''}
                    // Convert input value back to ISO string for storage
                    onChange={(e) => onSectionChange({ ...section, countdownTo: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                    className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Select the exact date and time when the countdown will end.</p>
                </div>
        </div>
    )
}
export default TimerSectionEditor;