// ContentCard.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ContentCardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode; // Optional title for the card
  titleClassName?: string;          // Custom classes for the title
  actions?: React.ReactNode;        // Optional actions/buttons for the top right of the card
  className?: string;               // Custom classes for the main card div
  // You could add more specific props like 'noPadding', 'headerClassName', 'bodyClassName' etc. if needed
}

const ContentCard: React.FC<ContentCardProps> = ({
  children,
  title,
  titleClassName,
  actions,
  className,
}) => {
  return (
    <div
      className={twMerge(
        'bg-card text-card-foreground rounded-xl shadow-lg p-6', // Base styles
        // Your screenshots show a prominent shadow, so shadow-lg might be appropriate.
        // Adjust padding (p-6) and rounding (rounded-xl) as per your exact preference.
        // Looks like rounded-xl (12px) or rounded-2xl (16px) might be closer than rounded-lg.
        className // Allows overriding or adding more styles
      )}
    >
      {(title || actions) && ( // Render header only if title or actions are provided
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-border">
          {/* Title */}
          {title && (
            typeof title === 'string' ? (
              <h2
                className={twMerge(
                  'text-xl font-poppins font-semibold text-foreground', // Default title style
                  titleClassName
                )}
              >
                {title}
              </h2>
            ) : (
              // If title is a ReactNode, render it directly
              <div className={twMerge('text-xl font-poppins font-semibold text-foreground', titleClassName)}>
                {title}
              </div>
            )
          )}

          {/* Actions Slot (e.g., buttons, search bar) */}
          {actions && <div className="mt-3 sm:mt-0 flex items-center space-x-3">{actions}</div>}
        </div>
      )}

      {/* Main Content Area */}
      <div>{children}</div>
    </div>
  );
};

export default ContentCard;