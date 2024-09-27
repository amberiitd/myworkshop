import { debounce } from "lodash";
import { useCallback, useMemo, useRef } from "react";

const shadwStyle = {
  vertical: {
    start: "0px -10px 10px -10px rgba(0, 0, 0, 0.9) inset",
    end: "0px 10px 10px -10px rgba(0, 0, 0, 0.9) inset",
  },
  horizontal: {
    start: "-10px 0px 10px -10px rgba(0, 0, 0, 0.9) inset",
    end: "10px 0px 10px -10px rgba(0, 0, 0, 0.9) inset",
  },
};

export const useScrollShadow = (props = { orientation: "vertical" }) => {
  const [orientation] = useMemo(() => [props.orientation], [props]);
  const containerRef = useRef();
  // const firstChildRef = useRef(null);
  // const lastChildRef = useRef(null);

  const handleScroll = useCallback(
    debounce(() => {
      const scrollElement = containerRef.current;
      if (scrollElement) {
        let [scrollStart, scrollEnd, clientSize] = [0, 0, 0];
        if (orientation === "vertical") {
          scrollStart = scrollElement.scrollTop;
          scrollEnd = scrollElement.scrollHeight;
          clientSize = scrollElement.clientHeight;
        } else if (orientation === "horizontal") {
          scrollStart = scrollElement.scrollLeft;
          scrollEnd = scrollElement.scrollWidth;
          clientSize = scrollElement.clientWidth;
        }
        let shadow = "";
        if (scrollStart > 0) {
          shadow = shadwStyle[orientation].end;
        }
        if (scrollStart + clientSize < scrollEnd - 1) {
          if (shadow) {
            shadow += ", ";
          }
          shadow += shadwStyle[orientation].start;
        }
        scrollElement.style.boxShadow = shadow;
      }
    }, 100),
    []
  );

  // useEffect(() => {
  //   // Create first and last child elements
  //   const firstChild = document.createElement("div");
  //   // firstChild.textContent = "First Child";
  //   firstChild.style.height = '12px';
  //   firstChild.style.position = "sticky";
  //   firstChild.style.top = "-12px";
  //   firstChild.style.boxShadow = "0px 4px 2px -2px gray"; // Example shadow style

  //   const lastChild = document.createElement("div");
  //   // lastChild.textContent = "Last Child";
  //   lastChild.style.height = '12px';
  //   lastChild.style.position = "sticky";
  //   lastChild.style.bottom = "-12px";
  //   lastChild.style.boxShadow = "0px -4px 2px -2px gray"; // Example shadow style

  //   // Store references
  //   firstChildRef.current = firstChild;
  //   lastChildRef.current = lastChild;

  //   // Insert first and last child elements
  //   if (containerRef.current) {
  //     containerRef.current.style.position = "relative";
  //     containerRef.current.insertBefore(firstChild, containerRef.current.firstChild);
  //     containerRef.current.appendChild(lastChild);
  //   }

  //   // Cleanup function to remove the elements
  //   return () => {
  //     if (containerRef.current.contains(firstChild)) {
  //       containerRef.current.removeChild(firstChildRef.current);
  //     }
  //     if (containerRef.current.contains(lastChild)) {
  //       containerRef.current.removeChild(lastChildRef.current);
  //     }
  //   };
  // }, []);

  return {
    ref: (node) => {
      if (node) {
        containerRef.current = node;
        const scrollElement = containerRef.current;
        handleScroll(); // Initial check
        scrollElement.addEventListener("scroll", handleScroll);
      }
    },
  };
};
