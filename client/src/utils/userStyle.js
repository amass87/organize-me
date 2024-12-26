// Utility to handle userStyle
export const initUserStyle = () => {
  if (!window.userStyleHandler) {
    window.userStyleHandler = {
      register: () => null,
      onreset: () => false,
      style: 'Normal'
    };
  }

  // Prevent reset events
  const preventReset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  document.addEventListener('reset', preventReset, true);
  return () => document.removeEventListener('reset', preventReset, true);
};
