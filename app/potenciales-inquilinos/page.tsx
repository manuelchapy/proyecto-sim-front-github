"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ContractModal from "../../components/ContractModal"; // Importamos el modal

interface Inquilino {
  _id: string;
  nombre: string;
  capacidad_pago: number;
  nivel_requerido: number;
  tiempo_contrato: number;
}

export default function InquilinosPage() {
  const searchParams = useSearchParams();
  const propiedadId = searchParams.get("propiedadId");
  const usuarioId = searchParams.get("usuarioId");

  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquilino, setSelectedInquilino] = useState<Inquilino | null>(null);

  useEffect(() => {
    if (!propiedadId || !usuarioId) {
      setError("Faltan parámetros en la URL");
      setLoading(false);
      return;
    }

    const fetchInquilinos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/potenciales-inquilinos/${propiedadId}/${usuarioId}`);
        
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.status}`);
        }

        const data = await response.json();
        setInquilinos(data.inquilinos || []);
      } catch (error) {
        console.error("Error obteniendo inquilinos:", error);
        setError("No se pudieron obtener los inquilinos.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquilinos();
  }, [propiedadId, usuarioId]);

  if (loading) return <p className="text-center mt-10 text-xl font-semibold">Cargando...</p>;
  if (error) return <p className="text-center text-red-500 text-lg font-semibold">{error}</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Potenciales Inquilinos</h1>

      {inquilinos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {inquilinos.map((inquilino) => (
            <div key={inquilino._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
              <h3 className="text-xl font-bold text-black">{inquilino.nombre}</h3>
              <p className="text-gray-700 font-medium">Nivel Requerido: <span className="font-semibold">{inquilino.nivel_requerido}</span></p>
              <p className="text-gray-700 font-medium">Capacidad de Pago: <span className="font-semibold">${inquilino.capacidad_pago}</span></p>
              <button
                onClick={() => setSelectedInquilino(inquilino)}
                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
              >
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6 text-lg font-semibold">No hay inquilinos disponibles.</p>
      )}

      {/* Modal de Contrato */}
      {selectedInquilino && (
        <ContractModal
          inquilino={selectedInquilino}
          propiedadId={propiedadId}
          usuarioId={usuarioId} // ✅ Agregamos usuarioId aquí
          onClose={() => setSelectedInquilino(null)}
        />
      )}
    </div>
  );
}