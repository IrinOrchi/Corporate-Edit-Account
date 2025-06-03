import { IStaticMethods } from 'preline/preline';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

// Initialize Preline
export const initializePreline = () => {
  if (typeof window !== 'undefined') {
    // Wait for Preline to be fully loaded
    const checkPreline = () => {
      if (window.HSStaticMethods) {
        console.log('Preline initialized');
        // Initialize all Preline components
        window.HSStaticMethods.autoInit();
        
        // Reinitialize after a short delay to ensure all components are properly initialized
        setTimeout(() => {
          console.log('Reinitializing Preline components');
          window.HSStaticMethods.autoInit();
          
          // Add event listeners for dropdowns
          document.querySelectorAll('[data-hs-dropdown-toggle]').forEach((element) => {
            element.addEventListener('click', (e) => {
              e.preventDefault();
              const targetId = element.getAttribute('data-hs-dropdown-toggle');
              const targetElement = document.getElementById(targetId || '');
              if (targetElement) {
                targetElement.classList.toggle('hidden');
              }
            });
          });
        }, 100);
      } else {
        console.log('Preline not loaded yet, retrying...');
        // If Preline isn't loaded yet, try again in 100ms
        setTimeout(checkPreline, 100);
      }
    };
    
    // Start checking for Preline
    checkPreline();
  }
};

// Function to reinitialize Preline components
export const reinitializePreline = () => {
  if (typeof window !== 'undefined' && window.HSStaticMethods) {
    console.log('Reinitializing Preline');
    window.HSStaticMethods.autoInit();
    
    // Re-add event listeners
    document.querySelectorAll('[data-hs-dropdown-toggle]').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = element.getAttribute('data-hs-dropdown-toggle');
        const targetElement = document.getElementById(targetId || '');
        if (targetElement) {
          targetElement.classList.toggle('hidden');
        }
      });
    });
  }
};

// Export the initialization function
export default initializePreline; 