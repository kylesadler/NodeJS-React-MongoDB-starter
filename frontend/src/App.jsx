import React from "react";
import ReactGA from "react-ga";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter,
} from "react-router-dom";

GOOGLE_ANALYTICS_TAG = undefined;
const isLocalhost = () => {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === ""
  );
};

if (!isLocalhost() && GOOGLE_ANALYTICS_TAG) {
  ReactGA.initialize(GOOGLE_ANALYTICS_TAG);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const GoogleAnalyticsContainer = withRouter(({ history, children }) => {
  history.listen(({ pathname, search }) => {
    if (!isLocalhost()) {
      ReactGA.pageview(pathname + search);
    }
  });

  return children;
});

export default () => {
  return (
    <Router>
      <GoogleAnalyticsContainer>
        <Switch>
          <Route path="/hello">
            <h1 style={{ textAlign: "center" }}>Website Works!</h1>
          </Route>
          <Route path="">
            <Redirect to="/hello" />
          </Route>
        </Switch>
      </GoogleAnalyticsContainer>
    </Router>
  );
};
