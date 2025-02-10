import React, { useState, useEffect, useRef } from 'react';
import ArtistCategoryCard from './ArtistCategoryCard';  
import config from '../configs/config';
import { useNavigate } from 'react-router-dom';
import Loading from '../pages/error/loading';
import Error from '../pages/error/Error';

const styles = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;            /* Chrome, Safari and Opera */
  }
`;

export default function CategorywiseArtist() {
  console.log("Hello React")  // This should print immediately when component mounts
  const [artistTypes, setArtistTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      // Calculate the width of one card plus its margin
      const cardWidth = 256 + 24; // w-64 (256px) + space-x-6 (24px)
      const newScrollPosition = container.scrollLeft + (direction === 'left' ? -cardWidth : cardWidth);
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchArtistTypes = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/api/artist-types/`);
                
        if (!response.ok) {
          throw new Error('Failed to fetch artist types');
        }
        
        const data = await response.json();

        setArtistTypes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistTypes();
  }, []);


  if (loading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <Error message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Artist Categories
          </h2>
          
          <div className="relative">
            {/* Left scroll button */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Scrollable container */}
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 hide-scrollbar px-8"
            >
              <div className="flex space-x-4 min-w-max">
                {/* Add an empty div at the start for better spacing */}
                <div className=""></div>
                
                {artistTypes && artistTypes.length > 0 ? (
                  artistTypes.map((artistType) => (
                    <div 
                      key={artistType._id} 
                      className="w-64 flex-shrink-0 transition-transform duration-300 hover:scale-105"
                    >
                      <ArtistCategoryCard
                        artist={{
                          name: artistType.type,
                          image: artistType.typeimg
                        }}
                        onClick={() => {
                          console.log(`Selected artist type: ${artistType.type}`);
                          navigate(`/${artistType._id}`);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    No artist types found
                  </div>
                )}
                
                {/* Add an empty div at the end for better spacing */}
                <div className=""></div>
              </div>
            </div>

            {/* Right scroll button */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
