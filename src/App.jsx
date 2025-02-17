import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Inicio from './paginas/Inicio'
import Rutas from './paginas/Rutas'
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/rutas" element={<Rutas />} />
    </Routes>
  )
}

export default App
