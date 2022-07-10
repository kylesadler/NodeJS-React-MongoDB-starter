import Script from "next/script";

import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { useRouter } from "next/router";

// TODO check G Analytics logic
const GOOGLE_ANALYTICS_TAG = process.env.GOOGLE_ANALYTICS_TAG;

const googleAnalyticsEnabled = () => {
  return GOOGLE_ANALYTICS_TAG && !isLocalhost();
};

const isLocalhost = () => {
  return (
    typeof window != "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "")
  );
};

if (googleAnalyticsEnabled()) {
  ReactGA.initialize(GOOGLE_ANALYTICS_TAG);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function CustomApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (googleAnalyticsEnabled()) {
        console.log(url, "url");
        ReactGA.pageview(url);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}

export default CustomApp;
