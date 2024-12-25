import React, { createContext, useContext, useEffect, useState } from 'react';
import { Tag } from './types';
import { useAsyncStorage } from './useAsyncStorage';

type TagContextType = {
  tags: Tag[];
  addTag: (tag: Tag) => void;
  updateTag: (id: string, label: string) => void;
  deleteTag: (id: string) => void;
};

const TagContext = createContext<TagContextType | undefined>(undefined);

export const TagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tags, setTags] = useAsyncStorage<Tag[]>('TAGS', []);

  const addTag = (tag: Tag) => {
    const updatedTags = [...tags, tag];
    setTags(updatedTags);
  };

  const updateTag = (id: string, label: string) => {
    const updatedTags = tags.map((tag) => (tag.id === id ? { ...tag, label } : tag));
    setTags(updatedTags);
  };

  const deleteTag = (id: string) => {
    const updatedTags = tags.filter((tag) => tag.id !== id);
    setTags(updatedTags);
  };

  return (
    <TagContext.Provider value={{ tags, addTag, updateTag, deleteTag }}>
      {children}
    </TagContext.Provider>
  );
};

export const useTags = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTags must be used within a TagProvider');
  }
  return context;
};