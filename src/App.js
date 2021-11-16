import React from 'react'
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Container } from '@mui/material'
import { Header } from './components/Header'
import { Main } from './components/Main'
import { About } from './components/About'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Container maxWidth="md">
          <Routes>
            <Route exact path="/" element={<Main />} />
            <Route path="/home" element={<Main />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  )
}

export default App
