import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/navbar/Navbar";

function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="pagina">
      <Navbar />
      <div className="contenido">
        <h1 className="titulo">IberoMoto</h1>
      </div>
    </div>
  );
}

export default Inicio;
