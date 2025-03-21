import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import AddWordPage from './pages/AddWordPage';
import QuizPage from './pages/QuizPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <Router>
          <div className="app-container">
            <nav className="navbar">
              <ul>
                <li><Link to="/">Main Menu</Link></li>
                <li><Link to="/quiz">Quiz</Link></li>
              </ul>
            </nav>
            <div className="content">
              <Routes>
                <Route path="/add-word/:id" element={<AddWordPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/" element={<HomePage />} />
              </Routes>
            </div>
          </div>
        </Router>
  );
}

export default App;
