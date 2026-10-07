import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search } from "@hooks/SearchResult";

export const SearchBar = ({ items = [] }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (e: Event) => {
    const val = e.target.value;
    setQuery(val);

    const resultados = Search.autocompletado(val, items);
    setResults(resultados);
    setIsOpen(resultados.length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsDocked(mainElement.scrollTop > window.innerHeight * 0.4);
          ticking = false;
        });
        ticking = true;
      }
    };

    mainElement.addEventListener("scroll", handleScroll);
    return () => mainElement.removeEventListener("scroll", handleScroll);
  }, []);

  const bar = (
    <div
      ref={searchRef}
      className={`z-50 transition-all duration-700 ease-in-out ${
        isDocked
          ? "search-bar-docked fixed top-4 right-4 w-72 sm:w-80 scale-90"
          : "relative w-full max-w-xl mx-auto"
      }`}
    >
      <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 pointer-events-none"></div>

      <div className="relative w-full flex items-center bg-zinc-900/90 border border-zinc-800 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
        <div className="pl-3 pr-2 text-zinc-400 pointer-events-none">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <input
          name="GlobalSearch"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Buscar en el Siglo XXI..."
          className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none px-2 py-1.5 text-sm font-normal"
          autoComplete="off"
        />

        <button className="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95 shrink-0">
          Buscar
        </button>
      </div>

      {isOpen && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl z-50 text-left divide-y divide-zinc-800/50 max-h-60 overflow-y-scroll scrollbar-none">
          {results.map((item) => (
            <li
              key={item.id || item.url || item.tituloCompleto}
              className="transition-colors hover:bg-indigo-600/20"
            >
              <a
                href={item.url || "#"}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-zinc-200 text-xs sm:text-sm font-medium hover:text-indigo-300 transition-colors select-none"
              >
                {item.tituloCompleto}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return isDocked ? createPortal(bar, document.body) : bar;
};
