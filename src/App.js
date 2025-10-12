import './App.css';
import React from 'react';
import Home from '../src/components/Home';
import About from '../src/components/About';
import Contact from '../src/components/Contact';
import Projects from '../src/components/Projects';
import Skill from '../src/components/Skill';
import NavBar from '../src/components/nav-bar';
import { Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skill />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
export default App;