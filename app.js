// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Game1 from './game1';
import Game2 from './game2';

export default function App() {
  return (
    <Router>
      <div>
        <h1>Game Hub</h1>
        <nav>
          <Link to="/game1"><button>Play Game 1</button></Link>
          <Link to="/game2"><button>Play Game 2</button></Link>
        </nav>
        <Routes>
          <Route path="/game1" element={<Game1 />} />
          <Route path="/game2" element={<Game2 />} />
        </Routes>
      </div>
    </Router>
  );
}
