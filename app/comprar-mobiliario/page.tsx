"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Mobiliario {
  _id: string;
  nombre: string;
  precio: number;
  experiencia: number;
  nivel_acceso: number;
}

export default function ComprarMobiliarioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const propiedadId = searchParams.get("propiedadId") || "";

  const [mobiliario, setMobiliario] = useState<Mobiliario[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dineroDisponible, setDineroDisponible] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("!!!!!!!!!!!!!!!", `http://localhost:3000/api/mobiliario/lista/compra/${userId}`);
    fetch(`http://localhost:3000/api/mobiliario/lista/compra/${userId}`)
      .then(response => {
        if (!response.ok) throw new Error("No se pudo obtener el mobiliario");
        return response.json();
      })
      .then(data => {
        console.log("✅ Datos de mobiliario recibidos:", data);
        setMobiliario(data.mobiliarios || []);
        setDineroDisponible(data.dinero || 0);
        setLoading(false);
      })
      .catch(error => console.error("❌ Error al cargar mobiliario:", error));
  }, [userId]);

  const toggleSelection = (id: string, precio: number) => {
    const isSelected = selectedItems.includes(id);
    const totalCost = selectedItems.reduce((sum, itemId) => {
      const item = mobiliario.find(m => m._id === itemId);
      return sum + (item ? item.precio : 0);
    }, isSelected ? -precio : precio);

    if (totalCost > dineroDisponible) {
      alert("No tienes suficiente dinero para esta compra");
      return;
    }

    setSelectedItems(prev =>
      isSelected ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const realizarCompra = () => {
    fetch(`http://localhost:3000/api/mobiliario/comprar/${userId}/${propiedadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobiliarioIds: selectedItems })
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        router.push("/dashboard");
      })
      .catch(error => {
        console.error("❌ Error al realizar compra:", error);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-black">Comprar Mobiliario</h1>
      <p className="text-black font-bold">Dinero disponible: ${dineroDisponible}</p>

      {loading ? (
        <p className="text-gray-500 mt-4">Cargando mobiliario...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {mobiliario.map(item => (
            <div key={item._id} className={`bg-white p-4 rounded-lg shadow-md ${selectedItems.includes(item._id) ? "border-2 border-green-500" : ""}`}>
              <h3 className="text-lg font-bold text-black">{item.nombre}</h3>
              <p className="text-gray-600">Precio: ${item.precio}</p>
              <p className="text-gray-600">Experiencia: {item.experiencia}</p>
              <p className="text-gray-600">Nivel requerido: {item.nivel_acceso}</p>

              <button
                onClick={() => toggleSelection(item._id, item.precio)}
                className={`mt-3 px-4 py-2 rounded transition ${selectedItems.includes(item._id) ? "bg-red-500 text-white hover:bg-red-700" : "bg-green-500 text-white hover:bg-green-700"}`}
              >
                {selectedItems.includes(item._id) ? "Quitar" : "Seleccionar"}
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={realizarCompra}
        disabled={selectedItems.length === 0}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        Comprar Seleccionados
      </button>
    </div>
  );
}
