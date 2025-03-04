"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InmobiliarioModalProps {
  propiedadId: string;
  userId: string;
  onClose: () => void;
}

interface Mobiliario {
  _id: string;
  nombre: string;
  descripcion: string;
  estado: string;
}

export default function InmobiliarioModal({ propiedadId, userId, onClose }: InmobiliarioModalProps) {
  const [mobiliario, setMobiliario] = useState<Mobiliario[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log(`http://localhost:3000/api/mobiliario/${propiedadId}/${userId}`);
    if (!propiedadId || !userId) return;
    fetch(`http://localhost:3000/api/mobiliario/${propiedadId}/${userId}`)
      .then(response => {
        if (!response.ok) throw new Error("No se pudo obtener el mobiliario");
        return response.json();
      })
      .then(data => {
        setMobiliario(data.mobiliario || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Error al cargar mobiliario:", error);
        setLoading(false);
      });
  }, [propiedadId, userId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-xl font-bold text-black">Mobiliario de la Propiedad</h2>

        {loading ? (
          <p className="text-gray-500 mt-4">Cargando mobiliario...</p>
        ) : mobiliario.length > 0 ? (
          <ul className="mt-4 text-black text-left">
            {mobiliario.map(item => (
              <li key={item._id} className="mb-2 border-b pb-2">
                <p className="font-bold">{item.nombre}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No hay mobiliario en esta propiedad.</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar
        </button>

        <button
          onClick={() => router.push(`/comprar-mobiliario?userId=${userId}&propiedadId=${propiedadId}`)}
          className="mt-4 ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Comprar Mobiliario
        </button>
      </div>
    </div>
  );
}
