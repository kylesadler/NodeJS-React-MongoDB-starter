import { Html, Head, Main, NextScript } from "next/document";
import ReactGA from "react-ga";

const GOOGLE_ADSENSE_TAG = process.env.GOOGLE_ADSENSE_TAG;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* insert Favicon links here */}

        {/* insert google Adsense link */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9744302951675363"
          crossorigin="anonymous"
        ></script>

        {/* Add title and description to each page:
        
        <title>Change Me!</title>
        <meta
          name="description"
          content="This is a meta description. Change me!"
        />
        
        */}
      </Head>
      <body style={{ backgroundColor: "#FFFFFF" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
