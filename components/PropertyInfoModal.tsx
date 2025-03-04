"use client";

import { useEffect, useState } from "react";

interface PropertyInfoModalProps {
  propiedad: any;
  userId: string; // ✅ Se agrega el userId para hacer la consulta correcta
  onClose: () => void;
}

interface Inquilino {
  _id: string;
  nombre: string;
  capacidad_pago: number;
  tiempo_contrato: number;
  nivel_requerido: number;
}

export default function PropertyInfoModal({ propiedad, userId, onClose }: PropertyInfoModalProps) {
  const [inquilino, setInquilino] = useState<Inquilino | null>(null);
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    console.log("+++++++++++++++++++", `http://localhost:3000/api/inquilinos/${propiedad._id}/${userId}`)
    console.log(propiedad)
    if (propiedad.alquilado) {
      fetch(`http://localhost:3000/api/inquilinos/${propiedad._id}/${userId}`)
        .then(response => {
          if (!response.ok) throw new Error("No se pudo obtener el inquilino");
          return response.json();
        })
        .then(data => {
          setInquilino(data.inquilino); // ✅ Ajustado para obtener solo el objeto `inquilino`
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al cargar inquilino:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [propiedad, userId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-xl font-bold text-black">Información de la Propiedad</h2>

        <p className="mt-2 text-black font-bold">{propiedad.nombre}</p>
        <p className="text-gray-600">Tipo: {propiedad.tipo}</p>
        <p className="text-gray-600">Valor: ${propiedad.valor}</p>

        {loading ? (
          <p className="text-gray-500 mt-4">Cargando inquilino...</p>
        ) : inquilino ? (
          <>
            <h3 className="mt-4 text-lg font-bold text-black">Inquilino</h3>
            <p className="text-black font-bold">{inquilino.nombre}</p>
            <p className="text-gray-600">Capacidad de Pago: ${inquilino.capacidad_pago}</p>
            <p className="text-gray-600">Tiempo de Contrato: {inquilino.tiempo_contrato} meses</p>
            <p className="text-gray-600 font-bold">Renta mensual: ${propiedad.valor}</p>
          </>
        ) : (
          <p className="text-gray-500 mt-4">No hay inquilino asignado.</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}