import React, { useEffect } from 'react';

const GTranslateWidget = () => {
  useEffect(() => {
    const wrapper = document.querySelector('.gtranslate_wrapper');
    
    // Only proceed if wrapper exists and script hasn't been added yet
    if (wrapper && !document.querySelector('[data-gtranslate-script]')) {
      // Configure GTranslate settings
      window.gtranslateSettings = {
        default_language: "en",
        languages: ["en", "fr", "it", "es", "nl", "cs", "zh-CN", "de"],
        wrapper_selector: ".gtranslate_wrapper",
        switcher_horizontal_position: "right",
        flag_style: "3d"
      };

      // Create and add script element
      const script = document.createElement('script');
      script.src = 'https://cdn.gtranslate.net/widgets/latest/float.js';
      script.defer = true;
      script.setAttribute('data-gtranslate-script', '');
      document.body.appendChild(script);
      
    }

    // Cleanup function
    return () => {
      const script = document.querySelector('[data-gtranslate-script]');
      if (script) {
        document.body.removeChild(script);
        delete window.gtranslateSettings;
      }
    };
  }, []);

  return <div className="gtranslate_wrapper" />;
};

export default GTranslateWidget;