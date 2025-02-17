import React from "react";
import Navbar from "../componentes/navbar/Navbar";
import Mapa from "../componentes/mapa/Mapa";


function Inicio() {
  return (
    <div className="navbar">
      <Navbar />
      <div className="contenido">
        <Mapa />
      </div>
    </div>
  );
}

export default Inicio;
