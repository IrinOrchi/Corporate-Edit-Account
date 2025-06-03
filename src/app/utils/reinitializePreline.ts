export const reinitializePreline = () => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.HSStaticMethods.autoInit();
      }, 0);
    }
  }