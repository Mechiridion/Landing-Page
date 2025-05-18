import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// This is a placeholder for the 3D animation
// In a real implementation, we would use react-three-fiber and three.js to create an actual 3D car animation
const CarAnimation = () => {
  const containerRef = useRef(null);
  
  // Simulate a loading state for the 3D model
  const [isLoading, setIsLoading] = React.useState(true);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden relative">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-800/30 backdrop-blur-sm">
          <div className="text-white text-center">
            <svg className="animate-spin h-10 w-10 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading 3D Model...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Placeholder for the 3D car model */}
          <img 
            src="https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Car engine illustration" 
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* Interactive hotspots */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              delay: 0.5, 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1]
            }}
          >
            <span className="text-white font-bold">1</span>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
              Engine Block
            </span>
          </motion.div>
          
          <motion.div 
            className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              delay: 0.7, 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1]
            }}
          >
            <span className="text-white font-bold">2</span>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
              Timing Belt
            </span>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded-full bg-green-500/80 flex items-center justify-center cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              delay: 0.9, 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1]
            }}
          >
            <span className="text-white font-bold">3</span>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
              Oil Filter
            </span>
          </motion.div>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-transparent pointer-events-none"></div>
        </>
      )}
    </div>
  );
};

export default CarAnimation;