import * as Icons from 'lucide-react';

/**
 * A helper component to dynamically render Lucide icons by name.
 * 
 * @param {string} name - The name of the Lucide icon to render (e.g. "Brain", "Settings")
 * @param {number|string} size - Sizing in pixels
 * @param {string} className - Additional CSS classes
 * @param {string} color - Optional color override
 */
const LucideIcon = ({ name, size = 20, className = '', color, ...props }) => {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    console.warn(`[LucideIcon] Icon "${name}" not found.`);
    return null;
  }

  return (
    <IconComponent 
      size={size} 
      className={`lucide-icon ${className}`} 
      color={color} 
      {...props} 
    />
  );
};

export default LucideIcon;
