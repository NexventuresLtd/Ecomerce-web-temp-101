
import { useNavigate } from "react-router-dom";

type NotFoundPageProps = {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
};

export default function NotFoundPage({
  title = "Page not found",
  subtitle = "We can't find the page you're looking for.",
  showSearch = false,
}: NotFoundPageProps) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-primary flex items-center justify-center px-6 py-12">
      <section className="max-w-4xl w-full rounded-2xl bg-white/5 backdrop-blur-md p-10 md:p-16 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-6xl font-extrabold leading-tight text-white">404</h1>
            <h2 className="mt-3 text-2xl font-semibold text-white/95">{title}</h2>
            <p className="mt-4 text-white/80 max-w-xl">{subtitle} If you followed a link, it may be out of date. You can go back to the homepage or try searching for what you need.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-3 rounded-lg bg-white text-primary px-5 py-3 font-medium shadow-sm hover:shadow-md transition"
              >
                Go home
              </button>

              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 text-white px-4 py-3 font-medium hover:bg-white/5 transition"
              >
                Go back
              </button>

              {showSearch && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const q = (form.elements.namedItem("q") as HTMLInputElement).value;
                    navigate(`/search?q=${encodeURIComponent(q)}`);
                  }}
                  className="mt-4 w-full sm:w-auto"
                >
                  <label htmlFor="q" className="sr-only">Search</label>
                  <div className="flex gap-2">
                    <input
                      id="q"
                      name="q"
                      placeholder="Search the site"
                      className="min-w-0 rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-white/60 focus:outline-none"
                    />
                    <button type="submit" className="rounded-lg bg-white text-primary px-4 py-2 font-medium">Search</button>
                  </div>
                </form>
              )}
            </div>

            <p className="mt-6 text-sm text-white/60">If this seems wrong, contact support at <a href="mailto:support@example.com" className="underline text-white/90">support@example.com</a>.</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {/* decorative illustration */}
            <svg
              width="320"
              height="240"
              viewBox="0 0 320 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect x="0" y="0" width="320" height="240" rx="16" fill="white" fillOpacity="0.06" />
              <g transform="translate(40,30)" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.9">
                <circle cx="80" cy="50" r="36" strokeOpacity="0.9" />
                <path d="M8 170c20-32 52-48 96-48s76 16 96 48" strokeOpacity="0.5" />
                <rect x="-8" y="120" width="176" height="8" rx="2" fill="white" fillOpacity="0.04" />
              </g>
              <text x="40" y="200" fill="white" fillOpacity="0.6" fontSize="12">Professional, clean 404 artwork</text>
            </svg>
          </div>
        </div>
      </section>
    </main>
  );
}
