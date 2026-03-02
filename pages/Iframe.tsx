import React, { useEffect, useRef } from "react";

const IframeEmbed = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const footer = doc.querySelector("footer");
        if (footer) footer.remove();
      } catch (err) {
        console.log("Cross-origin access blocked");
      }
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="https://clinexy.in/5-nft-projects-you-should-learn-about/"
      style={{ width: "100%", height: "100vh", border: "none" }}
      title="Article"
    />
  );
};

export default IframeEmbed;