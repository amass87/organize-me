// Create a global handler for userStyle
window.userStyleHandler = {
  register: () => {},
  reset: () => {},
  onChange: () => {}
};

// Prevent reset events globally
window.addEventListener('reset', (e) => {
  e.preventDefault();
  return false;
}, true);

export default window.userStyleHandler;
