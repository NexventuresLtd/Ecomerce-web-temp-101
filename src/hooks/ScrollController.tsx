import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // Delay scrolling a bit to ensure element is rendered
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // adjust delay as needed
    } else {
      // If no hash, scroll to top (optional)
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return null; // no UI output
};

export default ScrollToHash;
