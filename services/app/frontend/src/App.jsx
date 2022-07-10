import React, { useEffect } from "react";
import ReactGA from "react-ga";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

const GOOGLE_ANALYTICS_TAG = undefined;

const googleAnalyticsEnabled = () => {
  // return GOOGLE_ANALYTICS_TAG && !isLocalhost();
  return true;
};

const isLocalhost = () => {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === ""
  );
};

if (googleAnalyticsEnabled()) {
  // ReactGA.initialize(GOOGLE_ANALYTICS_TAG);
  ReactGA.initialize("sasdf", { debug: true });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const Content = () => {
  const location = useLocation();

  useEffect(() => {
    if (googleAnalyticsEnabled()) {
      const { pathname, search } = location;
      console.log(pathname, "pathname");
      console.log(search, "search");
      ReactGA.pageview(pathname + search);
    }
  }, [location]);

  return (
    <React.Fragment>
      <Route path="/hello">
        <h1 style={{ textAlign: "center" }}>Website Works!</h1>
      </Route>
      <Route path="">
        <Navigate to="/hello" />
      </Route>
    </React.Fragment>
  );
};

export default () => {
  return (
    <Router>
      <Routes>
        <Content />
      </Routes>
    </Router>
  );
};
