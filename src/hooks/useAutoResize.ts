import { useEffect, useRef } from 'react';

/**
 * Custom hook for auto-resizing textarea elements
 */
export const useAutoResize = (value: string, minHeight: number = 48, maxHeight: number = 200) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to allow shrinking
    textarea.style.height = `${minHeight}px`;
    
    // Calculate new height based on scroll height
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value, minHeight, maxHeight]);

  return textareaRef;
};
