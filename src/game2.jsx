// Game2.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';  // Use React Bootstrap for buttons
import '../styles/game2_styles.css'; // Import CSS for styling

const MAX_SELECTED_DOTS = 3; // Maximum dots to be selected

// Function to generate random dots
function generateDots(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `dot-${i}`,
    position: {
      x: Math.random() * (window.innerWidth - 60) + 30,
      y: Math.random() * (window.innerHeight - 150 - 60) + 30,
    },
    selected: false,
  }));
}

// Function to calculate the area of a polygon formed by selected points
function calculateArea(points) {
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

// Function to calculate distance between two points
function calculateDistance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export default function Game2() {
  const [level, setLevel] = useState(1);
  const [area, setArea] = useState(null);
  const [dots, setDots] = useState([]);
  const selectedIdsRef = useRef(new Set());

  useEffect(() => {
    const base = generateDots(3 + level); // Adjust based on level
    setDots(base);
    selectedIdsRef.current.clear();
  }, [level]);

  const handleFinish = () => {
    const selectedPoints = dots.filter((dot) => dot.selected).map((dot) => dot.position);
    if (selectedPoints.length >= 3) {
      const areaResult = calculateArea(selectedPoints);
      setArea(areaResult);
    }
  };

  const handleNextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    const newDots = generateDots(3 + newLevel); // Adjust based on level
    setDots(newDots);
    setArea(null);
    selectedIdsRef.current.clear();
  };

  const handleRetry = () => {
    setDots(prevDots => prevDots.map(dot => ({ ...dot, selected: false }))); // Unselect all dots
    setArea(null);
    selectedIdsRef.current.clear();
  };

  const selectedPoints = dots.filter((dot) => dot.selected).map((dot) => dot.position);

  return (
    <div className="game-container">
      <div className="engine-wrap">
        <svg width="100%" height="100%">
          {selectedPoints.length >= 3 && (
            <polygon
              points={selectedPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="rgba(255,0,0,0.3)"
              stroke="red"
              strokeWidth="2"
            />
          )}
          {dots.map((dot) => (
            <circle
              key={dot.id}
              cx={dot.position.x}
              cy={dot.position.y}
              r={12}
              fill={dot.selected ? 'green' : 'blue'}
            />
          ))}
        </svg>
      </div>

      <div className="controls">
        <Button variant="primary" onClick={handleFinish}>Finish</Button>
        {area !== null && (
          <>
            <div className="score">Area: {area.toFixed(2)}</div>
            <Button variant="secondary" onClick={handleNextLevel}>Next Level</Button>
          </>
        )}
        <Button variant="danger" onClick={handleRetry}>Retry</Button>
      </div>

      <div className="area-comparison">
        <div className="comparison-text">
          Max Area: 100 | Min Area: 50 {/* Example values, replace with actual logic */}
        </div>
      </div>
    </div>
  );
}
