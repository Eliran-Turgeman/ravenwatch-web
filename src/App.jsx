import { useEffect } from "react";
import { currentRoutePath } from "./lib/paths.js";
import { HomePage } from "./pages/HomePage.jsx";
import { ReportPage } from "./pages/ReportPage.jsx";

const routes = {
  "/": {
    component: HomePage,
    description:
      "Ravenwatch is an AI system for privacy and security review, built by Eliran Turgeman.",
    title: "Ravenwatch - AI privacy and security review system",
  },
  "/benchmarks": {
    component: ReportPage,
    description:
      "Read Ravenwatch's public engineering evaluation, methodology, headline results, and current limitations.",
    title: "Evaluation report - Ravenwatch",
  },
};

function App() {
  const route = routes[currentRoutePath()] ?? routes["/"];
  const Page = route.component;

  useEffect(() => {
    document.title = route.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", route.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", route.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", route.description);
  }, [route]);

  return <Page />;
}

export default App;
