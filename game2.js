import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, PanResponder } from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const CONTROL_HEIGHT = 150;
const MAX_SELECTED_DOTS = 3; // Maximum dots to be selected

// Function to generate random dots
function generateDots(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `dot-${i}`,
    position: {
      x: Math.random() * (width - 60) + 30,
      y: Math.random() * (height - CONTROL_HEIGHT - 60) + 30,
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

// Function to calculate the max and min areas from the set of dots
function calculateMaxMinArea(dots) {
  let maxArea = 0;
  let minArea = Infinity;

  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      for (let k = j + 1; k < dots.length; k++) {
        const points = [dots[i].position, dots[j].position, dots[k].position];
        const area = calculateArea(points);
        maxArea = Math.max(maxArea, area);
        minArea = Math.min(minArea, area);
      }
    }
  }

  return { maxArea, minArea };
}

export default function DotGame() {
  const [level, setLevel] = useState(1);
  const [area, setArea] = useState(null);
  const [dots, setDots] = useState([]);
  const [maxArea, setMaxArea] = useState(0);
  const [minArea, setMinArea] = useState(0);

  const selectedIdsRef = useRef(new Set());
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const x = gestureState.moveX;
        const y = gestureState.moveY;

        setDots((prevDots) => {
          const updatedDots = prevDots.map((dot) => {
            if (selectedIdsRef.current.has(dot.id)) return dot; // Skip already selected dots
            if (selectedIdsRef.current.size >= MAX_SELECTED_DOTS) return dot; // Prevent selecting more than 3 dots

            const dx = dot.position.x - x;
            const dy = dot.position.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 25) {
              selectedIdsRef.current.add(dot.id);
              return { ...dot, selected: true };
            }
            return dot;
          });

          return updatedDots;
        });
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  useEffect(() => {
    const base = generateDots(3 + level); // Adjust based on level
    setDots(base);
    selectedIdsRef.current.clear();

    const { maxArea, minArea } = calculateMaxMinArea(base);
    setMaxArea(maxArea);
    setMinArea(minArea);
  }, [level]);

  const handleFinish = () => {
    const selectedPoints = dots
      .filter((dot) => dot.selected)
      .map((dot) => dot.position);

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

    const { maxArea, minArea } = calculateMaxMinArea(newDots);
    setMaxArea(maxArea);
    setMinArea(minArea);
  };

  const handleRetry = () => {
    setDots((prevDots) =>
      prevDots.map((dot) => ({ ...dot, selected: false })) // Unselect all dots
    );
    setArea(null);
    selectedIdsRef.current.clear();
  };

  const selectedPoints = dots.filter((dot) => dot.selected).map((dot) => dot.position);

  return (
    <View style={styles.container}>
      <View style={styles.engineWrap} {...panResponder.panHandlers}>
        <Svg height="100%" width="100%">
          {selectedPoints.length >= 3 && (
            <Polygon
              points={selectedPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="rgba(255,0,0,0.3)"
              stroke="red"
              strokeWidth="2"
            />
          )}
          {dots.map((dot) => (
            <Circle
              key={dot.id}
              cx={dot.position.x}
              cy={dot.position.y}
              r={12}
              fill={dot.selected ? 'green' : 'blue'}
            />
          ))}
        </Svg>
      </View>

      <View style={styles.controls}>
        <Button title="Finish" onPress={handleFinish} />
        {area !== null && (
          <>
            <Text style={styles.score}>Area: {area.toFixed(2)}</Text>
            <Button title="Next Level" onPress={handleNextLevel} />
          </>
        )}
        <Button title="Retry" onPress={handleRetry} />
      </View>

      <View style={styles.areaComparison}>
        <Text style={styles.comparisonText}>
          Max Area: {maxArea.toFixed(2)} | Min Area: {minArea.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  engineWrap: {
    flex: 1,
  },
  controls: {
    height: CONTROL_HEIGHT,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'center',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  areaComparison: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
