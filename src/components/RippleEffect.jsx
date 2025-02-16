import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "jquery.ripples";

const RippleEffect = () => {
  const rippleContainerRef = useRef(null);

  useEffect(() => {
    const $rippleContainer = $(rippleContainerRef.current);

    // Initialize the ripple effect
    $rippleContainer.ripples({
      resolution: 512,
      dropRadius: 20, // px
      perturbance: 0.04,
    });

    // Handle click to create ripples
    $rippleContainer.on("click", function (e) {
      const x = e.pageX - $rippleContainer.offset().left;
      const y = e.pageY - $rippleContainer.offset().top;
      $rippleContainer.ripples("drop", x, y, 30, 0.03);
    });

    // Cleanup on unmount
    return () => {
      $rippleContainer.ripples("destroy");
      $rippleContainer.off("click");
    };
  }, []);

  return (
    <div
      id="ripple-container"
      ref={rippleContainerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, // Ensure it's behind other content
      }}
    ></div>
  );
};

export default RippleEffect; 