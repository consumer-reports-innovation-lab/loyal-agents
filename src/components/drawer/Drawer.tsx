import React, { useEffect, useState, useRef } from 'react';
import type { CollectionEntry } from 'astro:content';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  focusAreas: {
    id: string;
    title: string;
    subtitle: string;
    color: string;
    number: string;
    description: string;
    tags: string[];
    featuredResources: CollectionEntry<'resources'>[];
  }[];
  currentAreaId: string;
  onAreaChange: (areaId: string) => void;
  resources: CollectionEntry<'resources'>[];
}

export default function Drawer({
  focusAreas,
  resources
}: Omit<DrawerProps, 'isOpen' | 'onClose' | 'currentAreaId' | 'onAreaChange'>) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAreaId, setCurrentAreaId] = useState(focusAreas[0]?.id || '');
  const [currentArea, setCurrentArea] = useState(focusAreas.find(area => area.id === currentAreaId));
  const [featuredResources, setFeaturedResources] = useState<CollectionEntry<'resources'>[]>([]);
  const [latestResources, setLatestResources] = useState<CollectionEntry<'resources'>[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Function to scroll content to top
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  // console.log("resources:", featuredResources);

  useEffect(() => {
    // Listen for drawer open events
    const handleOpenDrawer = (event: CustomEvent<{ areaId: string }>) => {
      setCurrentAreaId(event.detail.areaId);
      setIsOpen(true);
      // Prevent page scrolling when drawer is open
      document.body.style.overflow = 'hidden';
    };

    // Handle ESC key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('openDrawer', handleOpenDrawer as EventListener);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('openDrawer', handleOpenDrawer as EventListener);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  useEffect(() => {
    setCurrentArea(focusAreas.find(area => area.id === currentAreaId));
    // Scroll to top when area changes
    scrollToTop();
  }, [currentAreaId, focusAreas]);

    useEffect(() => {
    if (currentArea) {
      // Set featured resources from the area's configuration
      setFeaturedResources(currentArea.featuredResources || []);

      // Filter non-featured resources that match the area's tags
      const nonFeaturedResources = resources.filter(resource =>
        // Exclude featured resources
        !currentArea.featuredResources.includes(resource) &&
        // Include if it matches any of the area's tags
        resource.data.tags.some(tag =>
          currentArea.tags.some(areaTag =>
            tag.toLowerCase() === areaTag.toLowerCase()
          )
        )
      );

      // Set latest resources (already sorted by date in the Astro component)
      setLatestResources(nonFeaturedResources);
    }
  }, [currentArea, resources]);

  // Reset body overflow when drawer closes
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const currentIndex = focusAreas.findIndex(area => area.id === currentAreaId);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === focusAreas.length - 1;

  const handlePrevious = () => {
    if (!isFirstTab) {
      const prevIndex = currentIndex - 1;
      setCurrentAreaId(focusAreas[prevIndex].id);
    }
  };

  const handleNext = () => {
    if (!isLastTab) {
      const nextIndex = currentIndex + 1;
      setCurrentAreaId(focusAreas[nextIndex].id);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 z-[9998] ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full lg:max-w-5xl  bg-white transform transition-transform duration-300 z-[9999] flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header with tabs */}
        <div className="h-28 pe-4 md:pe-6 relative flex flex-row-reverse items-center justify-between">
          <button
            onClick={() => setIsOpen(false)}
            className="w-12 h-12 hover:opacity-80 transition-opacity group"
          >
            <div className="rotate-45 transition-all group-hover:scale-110 group-hover:rotate-50">
              <svg width="45" height="45" viewBox="0 0 58 58" fill="none">
                <rect width="58" height="58" rx="29" fill="black" />
                <path
                  d="M29 19V39M19 29H39"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </button>

          {/* Tabs */}
          <div className="flex items-center h-full gap-4 space-x-0 md:space-x-8 w-full flex-1 px-4 justify-start">
            {focusAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => setCurrentAreaId(area.id)}
                className={`gap-2 flex items-center space-x-4 border-b-2 pb-4 px-2 transition-all hover:border-[#3A8DC7]
                    ${area.id === currentAreaId ? `!border-black` : ""}
                  `}
              >
                <div
                  style={{ backgroundColor: area.color }}
                  className={`w-8 h-8 me-0 sm:me-4 rounded-full flex items-center justify-center `}
                >
                  <span
                    className={`text-base font-medium !pe-0 ${
                      focusAreas[0].id === area.id ? "text-black" : "text-white"
                    }`}
                  >
                    {area.number}
                  </span>
                </div>
                <span
                  className={`sm:!block text-sm sm:text-lg font-medium sm:tracking-wide uppercase
                  ${area.id === currentAreaId ? `block` : "hidden"}
                  `}
                >
                  {area.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="h-full overflow-y-auto px-4 md:px-20 py-14">
          {/* Tags */}
          <div className="flex gap-4">
            {currentArea?.tags?.map((tag) => (
              <span
                key={tag}
                className="px-5 py-[5px] bg-[#F0F0F0] rounded-full text-sm font-bold tracking-[0.7px] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="mt-8 text-4xl leading-tight font-medium">
            {currentArea?.title}
          </h2>

          {/* Featured Resources */}
          {featuredResources.length > 0 && (
            <>
              <div className="mt-[60px] inline-flex px-[25px] py-[7px] bg-black rounded-full">
                <span className="text-lg font-bold tracking-[0.9px] text-white">
                  FEATURED RESOURCES
                </span>
              </div>

              <div className="mt-8 space-y-4">
                {featuredResources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.data.link}
                    target="_blank"
                    className="relative block p-6 border border-[#E1E1E1] rounded-[10px] hover:border-black transition-colors"
                  >
                    <div
                      className="absolute left-0 top-0 w-2 h-full rounded-l-lg"
                      style={{ backgroundColor: "#E1E1E1" }}
                    ></div>
                    <h3 className="text-[23px] font-medium mb-8">
                      {resource.data.title}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-lg font-medium tracking-[1.8px] uppercase mr-2">
                        READ
                      </span>
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                      >
                        <path
                          d="M1 8H16M16 8L9 1M16 8L9 15"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* Latest Resources */}
          {latestResources.length > 0 && (
            <>
              <div className="mt-12 inline-flex px-6 py-2 bg-black rounded-full">
                <span className="text-lg font-bold text-white uppercase tracking-wide">
                  Latest Resources
                </span>
              </div>

              <div className="mt-8 space-y-4">
                {latestResources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.data.link}
                    target="_blank"
                    className="relative block p-6 border border-[#E1E1E1] rounded-[10px] hover:border-black transition-colors"
                  >
                    <div
                      className="absolute left-0 top-0 w-2 h-full rounded-l-lg"
                      style={{ backgroundColor: "#E1E1E1" }}
                    ></div>
                    <h3 className="text-[23px] font-medium mb-8">
                      {resource.data.title}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-lg font-medium tracking-[1.8px] uppercase mr-2">
                        READ
                      </span>
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                      >
                        <path
                          d="M1 8H16M16 8L9 1M16 8L9 15"
                          stroke="#02ad4d"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer navigation */}
        <div className="h-fit py-4 md:py-8 border-t border-[#E1E1E1] flex items-center justify-between px-11">
          <button
            onClick={handlePrevious}
            disabled={isFirstTab}
            className={`flex items-center space-x-3.5 transition-opacity ${
              isFirstTab
                ? "opacity-30 cursor-not-allowed"
                : "hover:opacity-80"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="rotate-180"
            >
              <path
                d="M12 4L20 12L12 20M20 12H4"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-medium tracking-wide">PREVIOUS</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isLastTab}
            className={`flex items-center space-x-3.5 transition-opacity ${
              isLastTab
                ? "opacity-30 cursor-not-allowed"
                : "hover:opacity-80"
            }`}
          >
            <span className="text-xl font-medium tracking-wide">NEXT</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4L20 12L12 20M20 12H4"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
