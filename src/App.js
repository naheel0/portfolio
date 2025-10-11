import './App.css';
import React from 'react';
import StarsBackground from './StarsBackground';
import NavBar from './nav-bar';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return(
    <div className='main-bg'>
      <StarsBackground />
      <NavBar />
    </div>
  )
}

export default App;
