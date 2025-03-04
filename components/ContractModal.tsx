"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ContractModalProps {
  inquilino: {
    _id: string;
    nombre: string;
    capacidad_pago: number;
    nivel_requerido: number;
    tiempo_contrato: number;
  };
  propiedadId: string | null;
  usuarioId: string | null;
  onClose: () => void;
}

const ContractModal: React.FC<ContractModalProps> = ({ inquilino, propiedadId, usuarioId, onClose }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mensajes por nivel de inquilino
  const mensajesPorNivel: { [key: number]: string } = {
    0: "Soy un estudiante que apenas tiene para pagar la cuota universitaria y tiene que conformarse con vivir en cualquier lado, pero vi tu habitación y por el precio me fascinó. Gracias por el precio tan solidario, estoy más que interesado en querer arrendar.",
    1: "Soy una persona que está empezando a independizarse y quiere vivir con su pareja en algo decente. Vimos tus ofertas y estamos más que interesados en alquilar.",
    2: "Estamos viajando por el mundo y queremos quedarnos por una temporada en esta ciudad. Tus alquileres son estupendos y estamos interesados.",
    3: "Vengo huyendo de la justicia porque me persiguen injustamente acusado de un desfalco a unos negocios de una ciudad que yo mismo ayudé, ¡ingratos! Quiero quedarme una temporada aquí. No es porque el lugar no tiene leyes de extradición, para nada, es que me fascina el ambiente y la falta de gente de mi país que me reconozca. Estoy dispuesto a pagarte el alquiler.",
  };

  // Función para aceptar el contrato
  const aceptarContrato = async () => {
    if (!usuarioId || !propiedadId || !inquilino) {
      alert("Faltan datos para aceptar el contrato.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/aceptar-inquilino", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: usuarioId,  // 🔹 Ahora está definido correctamente
          propiedadId: propiedadId,
          inquilinoId: inquilino._id
        })
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
  
      alert("Contrato aceptado con éxito!");
      window.location.href = "/dashboard"; // Redirigir al dashboard
  
    } catch (error) {
      console.error("Error al aceptar el contrato:", error);
      alert("Hubo un problema al aceptar el contrato.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-2xl font-bold text-center text-gray-900">Contrato de Arrendamiento</h2>
        <p className="mt-4 text-gray-800 font-medium">{mensajesPorNivel[inquilino.nivel_requerido]}</p>

        <div className="mt-4 border-t pt-4">
          <p className="text-gray-700 font-semibold">🏢 <strong>Mobiliaria Neo</strong></p>
          <p className="text-gray-700 font-semibold">🏠 Propiedad a alquilar: <span className="font-bold">{propiedadId}</span></p>
          <p className="text-gray-700 font-semibold">💰 Valor mensual: <span className="font-bold">${inquilino.capacidad_pago}</span></p>
          <p className="text-gray-700 font-semibold">📅 Cantidad de meses: <span className="font-bold">{inquilino.tiempo_contrato}</span></p>
          <p className="text-gray-700 font-semibold">📈 Prima de aumento en caso de temporada vacacional: <span className="font-bold">5% por dos meses</span></p>
          <p className="text-gray-700 font-semibold">🌪️ Reducción del alquiler en caso de huracanes: <span className="font-bold">10% por 1 mes</span></p>
        </div>

        {error && <p className="text-red-500 text-center font-semibold mt-3">{error}</p>}

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={aceptarContrato}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Procesando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;