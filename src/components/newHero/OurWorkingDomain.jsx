import React from 'react';

const AnimatedHoneycomb = ({ rows = 7, cols = 9 }) => {
  const grid = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      id: `${rowIndex}-${colIndex}`,
    }))
  );

  return (
    <div className="flex flex-col items-center">
      {grid.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center"
          style={{
            // Negative margin pulls rows together vertically
            marginTop: '-26px',
            // Staggers every other row to the right for the honeycomb pattern
            marginLeft: rowIndex % 2 === 1 ? '50px' : '0',
          }}
        >
          {row.map((cell) => (
            // This is the individual hexagon element
            <div key={cell.id} className="relative w-[100px] h-[110px] flex items-center justify-center hexagon-container">
              <svg
                className="absolute w-full h-full"
                viewBox="0 0 100 110"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Defines the gradient used for the glowing border */}
                <defs>
                  <linearGradient id="glowing-border" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="stop1" />
                    <stop offset="50%" className="stop2" />
                    <stop offset="100%" className="stop3" />
                  </linearGradient>
                </defs>
                {/* The hexagon shape, stroked with the animated gradient */}
                <polygon
                  className="hexagon-path"
                  points="50 5, 95 30, 95 80, 50 105, 5 80, 5 30"
                  fill="none"
                  stroke="url(#glowing-border)"
                  strokeWidth="3"
                />
              </svg>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedHoneycomb;