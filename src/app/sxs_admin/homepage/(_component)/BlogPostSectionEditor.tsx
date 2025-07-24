'use client';
import React from 'react';
import { BlogPost, Post } from '@/core/entities/HomePage.entity';
import ImageUploadPreview from './ImageUploadPreview';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BlogPostSectionEditorProps {
  section: BlogPost;
  onSectionChange: (newSection: BlogPost) => void;
  onFileUpload: (file: File) => Promise<string>;
}

const BlogPostSectionEditor = ({
  section,
  onSectionChange,
  onFileUpload,
}: BlogPostSectionEditorProps) => {
  const handleMainTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSectionChange({ ...section, title: e.target.value });
  };

  const handlePostChange = (
    postKey: 'post1' | 'post2' | 'post3',
    field: keyof Post,
    value: string
  ) => {
    onSectionChange({
      ...section,
      [postKey]: {
        ...section[postKey],
        [field]: value,
      },
    });
  };

  const PostEditor = ({
    post,
    postKey,
    onFileUpload,
    onPostChange,
    sectionId
  }: {
    post: Post;
    postKey: 'post1' | 'post2' | 'post3';
    onFileUpload: (file: File) => Promise<string>;
    onPostChange: (postKey: 'post1' | 'post2' | 'post3', field: keyof Post, value: string) => void;
    sectionId: string;
  }) => (
    <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
      <h5 className="text-md font-medium text-indigo-700 mb-3 capitalize">{postKey.replace('post', 'Post ')} Settings</h5>
      <ImageUploadPreview
        label="Image URL"
        imageUrl={post.imageUrl}
        onImageUrlChange={(url) => onPostChange(postKey, 'imageUrl', url)}
        onFileUpload={onFileUpload}
      />
      <div className="mb-3">
        <label htmlFor={`blog-post-${postKey}-alt-${sectionId}`}>Alt Text</label>
        <Input
          id={`blog-post-${postKey}-alt-${sectionId}`}
          type="text"
          value={post.imageAlt}
          onChange={(e) => onPostChange(postKey, 'imageAlt', e.target.value)}
          required
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Descriptive text for accessibility.</p>
      </div>
      <div className="mb-3">
        <label htmlFor={`blog-post-${postKey}-title-${sectionId}`}>Title</label>
        <Input
          id={`blog-post-${postKey}-title-${sectionId}`}
          type="text"
          value={post.title}
          onChange={(e) => onPostChange(postKey, 'title', e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor={`blog-post-${postKey}-description-${sectionId}`}>Description</label>
        <Textarea
          id={`blog-post-${postKey}-description-${sectionId}`}
          value={post.description}
          onChange={(e) => onPostChange(postKey, 'description', e.target.value)}
          required
          className="mt-1"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Blog Posts Section Settings</h3>

      <div>
        <label htmlFor={`blog-section-title-${section.id}`}>Section Title</label>
        <Input
          id={`blog-section-title-${section.id}`}
          type="text"
          value={section.title}
          onChange={handleMainTitleChange}
          required
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">The main title for the blog posts section.</p>
      </div>

      <h4 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Individual Blog Posts</h4>

      <div className="space-y-6">
        <PostEditor
          post={section.post1}
          postKey="post1"
          onFileUpload={onFileUpload}
          onPostChange={handlePostChange}
          sectionId={section.id}
        />
        <PostEditor
          post={section.post2}
          postKey="post2"
          onFileUpload={onFileUpload}
          onPostChange={handlePostChange}
          sectionId={section.id}
        />
        <PostEditor
          post={section.post3}
          postKey="post3"
          onFileUpload={onFileUpload}
          onPostChange={handlePostChange}
          sectionId={section.id}
        />
      </div>
    </div>
  );
};

export default BlogPostSectionEditor;