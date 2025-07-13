import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  showTooltip?: boolean;
  showInitials?: boolean;
}

export function TruncatedText({ 
  text, 
  maxLength = 50, 
  className = '', 
  showTooltip = true,
  showInitials = false
}: TruncatedTextProps) {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  const displayText = showInitials ? getInitials(text) : text;
  const shouldTruncate = text.length > maxLength;
  const truncatedText = shouldTruncate && !showInitials ? `${displayText.slice(0, maxLength)}...` : displayText;

  if (!shouldTruncate || !showTooltip) {
    return <span className={className}>{truncatedText}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-help ${className}`}>
            {truncatedText}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs break-words">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}