import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const useAOS = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });

    // Refresh AOS on route changes or dynamic content
    AOS.refresh();

    // Cleanup
    return () => {
      AOS.refreshHard();
    };
  }, []);

  // Return refresh function for manual refreshing
  return {
    refresh: () => AOS.refresh(),
    refreshHard: () => AOS.refreshHard()
  };
};

export default useAOS;