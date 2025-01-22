import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import PlayerForm from './pages/PlayerForm';
import Scoreboard from './pages/Scoreboard';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<PlayerForm />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
        </Routes>
    </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
