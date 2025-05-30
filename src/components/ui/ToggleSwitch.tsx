// ToggleSwitch.tsx
import React, { useId } from 'react';
import { twMerge } from 'tailwind-merge';

interface ToggleSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional: A label for accessibility, not directly visible like checkbox
  enabledText?: string;
  disabledText?: string;
  // id is optional; if not provided, useId() will generate one.
  // className can be used to style the outer wrapper.
  // 'checked' (boolean), 'onChange' (function), 'name' (string), 'disabled' (boolean for the input) are spread via ...props
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label, // For aria-label
  enabledText = 'Enabled',
  disabledText = 'Disabled',
  id: providedId,
  className, // For the main wrapper label
  checked,   // This prop controls the visual state
  disabled: inputIsDisabled, // Renamed to avoid conflict, controls native disabled attribute
  onChange, // Essential for a controlled component
  ...props   // Other native input attributes like 'name'
}) => {
  const autoId = useId();
  const id = providedId || autoId;

  const currentText = checked ? enabledText : disabledText;

  // --- Color Definitions (ensure these map to your Tailwind theme or CSS variables) ---
  // 'Enabled' state (typically green)
  const enabledBgColor = 'bg-green-200';        // Light green for pill background
  const enabledKnobColor = 'bg-success';          // Your theme's success color for knob
  const enabledTextColor = 'text-success';        // Your theme's success color for text

  // 'Disabled' (by toggle state, not HTML attribute) state (typically red)
  const toggledOffBgColor = 'bg-red-200';      // Light red for pill background
  const toggledOffKnobColor = 'bg-destructive';   // Your theme's destructive color for knob
  const toggledOffTextColor = 'text-destructive'; // Your theme's destructive color for text

  // Native HTML 'disabled' attribute state (grayed out)
//   const nativeDisabledBgColor = 'bg-muted';          
//   const nativeDisabledKnobColor = 'bg-muted-foreground/50';
  const nativeDisabledTextColor = 'text-muted-foreground'; // Your theme's muted text

  return (
    <label
      htmlFor={id}
      className={twMerge(
        'inline-flex items-center relative group', // Added group for potential hover on children
        inputIsDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
        className
      )}
      aria-label={label || (checked ? enabledText : disabledText)} // Accessibility label
    >
      {/* Hidden native checkbox (the peer) */}
      <input
        id={id}
        type="checkbox"
        className="sr-only peer" // Critical: 'sr-only' hides it, 'peer' enables styling based on its state
        checked={!!checked}     // Ensure it's always a boolean
        disabled={inputIsDisabled}
        onChange={onChange}     // Pass onChange to the native input
        {...props}              // Spread other native input props (e.g., name)
      />

      {/* Pill Background */}
      <div
        className={twMerge(
          'w-14 h-7 rounded-full transition-colors duration-200 ease-in-out flex items-center px-1 shrink-0',
          // --- Styling based on 'checked' state (Enabled/Disabled by toggle) ---
          checked ? enabledBgColor : toggledOffBgColor,
          // --- Styling for native 'disabled' attribute (overrides above if true) ---
          'peer-disabled:!bg-muted' // Use ! to ensure override for background
        )}
      >
        {/* Sliding Knob */}
        <div
          className={twMerge(
            'w-5 h-5 rounded-full bg-card shadow-md transform transition-transform duration-200 ease-in-out',
            // --- Knob color based on 'checked' state ---
            checked ? enabledKnobColor : toggledOffKnobColor,
            // --- Knob position based on 'checked' state ---
            // For a w-14 pill and w-5 knob with px-1 (0.25rem) padding:
            // Travel distance = 14 (units) - 5 (units) - 1 (unit left_padding) - 1 (unit right_padding) = 7 units
            // Tailwind's spacing scale is 1 unit = 0.25rem (4px). So, 7 units = 1.75rem or 28px.
            checked ? 'translate-x-[1.75rem]' : 'translate-x-0', // translate-x-[28px] or translate-x-7
            // --- Knob color for native 'disabled' attribute ---
            'peer-disabled:!bg-muted-foreground/50' // Use ! to ensure override for knob color
          )}
        />
      </div>

      {/* Text (Enabled/Disabled) */}
      { (enabledText || disabledText) && ( // Only render span if text is provided
        <span
          className={twMerge(
            'ml-3 text-sm font-medium select-none',
            // --- Text color based on 'checked' state ---
            checked ? enabledTextColor : toggledOffTextColor,
            // --- Text color for native 'disabled' attribute ---
            inputIsDisabled ? nativeDisabledTextColor : '' // Apply if HTML disabled is true
          )}
        >
          {currentText}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;