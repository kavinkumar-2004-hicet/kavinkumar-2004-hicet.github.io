import { useEffect, useRef } from "react";

declare global {
  interface Window {
    UnicornStudio: any;
  }
}

function App() {
  const unicornRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initUnicorn = () => {
      const u = window.UnicornStudio;
      if (u && u.init) {
        u.init();
      } else {
        window.UnicornStudio = { isInitialized: false };
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js";
        script.onload = () => {
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
              window.UnicornStudio.init();
            });
          } else {
            window.UnicornStudio.init();
          }
        };
        (document.head || document.body).appendChild(script);
      }
    };

    initUnicorn();

    return () => {
      // Cleanup: remove any injected canvases inside the container
      if (unicornRef.current) {
        const canvases = unicornRef.current.querySelectorAll("canvas");
        canvases.forEach((c) => c.remove());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Unicorn Studio WebGL Background */}
        <div
          ref={unicornRef}
          data-us-project="TXggBXl27gGTBcTSOvY3"
          className="absolute inset-0 z-0"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Welcome
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Start prompting (or editing) to see magic happen :)
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
