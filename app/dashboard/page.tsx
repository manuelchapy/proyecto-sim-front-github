"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import WelcomeModal from "../../components/WelcomeModal";
import PropertyInfoModal from "../../components/PropertyInfoModal";
import MobiliarioModal from "../../components/MobiliarioModal";
import { Propiedad } from "../../types/Propiedad";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMobiliarioModal, setShowMobiliarioModal] = useState(false);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedPropiedad, setSelectedPropiedad] = useState<Propiedad | null>(null);
  const [dinero, setDinero] = useState(0);
  const [experiencia, setExperiencia] = useState(0);  // ✅ Agregado aquí
  const [mensajePago, setMensajePago] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user || !user.id) {
        router.push("/login");
      } else {
        verificarUsuario(user.id);
        iniciarActualizacionPagos(user.id);
      }
    }
  }, [user, loading, router]);

  const verificarUsuario = async (userId: string) => {
    try {
      console.log(`🔍 Verificando datos del usuario ID: ${userId}`);
      const response = await fetch(`http://localhost:3000/api/checkUserData/${userId}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error en la respuesta del servidor:", errorText);
        throw new Error("Error en la API: " + response.status);
      }
      const data = await response.json();
      console.log("✅ Respuesta del servidor:", data);

      if (data.message.includes("Propiedades agregadas correctamente")) {
        setShowWelcomeModal(true);
        setModalMessage(
          "Tu abuelo ha muerto y te ha dejado una pequeña pensión, pero con la condición de que no te quedes solo con eso. ¡Convierte esto en un imperio inmobiliario!"
        );
      }

      setPropiedades(data.usuario.propiedades || []);
    } catch (error) {
      console.error("❌ Error al verificar datos del usuario:", error);
      setPropiedades([]);
    }
  };

const iniciarActualizacionPagos = async (userId: string) => {
  if (!userId) return console.error("⚠️ Error: userId es undefined.");

  const actualizarPagos = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/pagos/alquileres/${user.id}`);
      if (!response.ok) throw new Error("No se pudo obtener el estado de alquileres");
      const data = await response.json();
  
      console.log("📡 Datos recibidos del backend:", data);
  
      setDinero(data.dinero);
      setExperiencia(data.experiencia); // ✅ Ahora `setExperiencia` está definido correctamente
      setMensajePago(`💰 +$${data.dinero - dinero} | ✨ +${data.experiencia - experiencia} XP`);
    } catch (error) {
      console.error("Error al actualizar alquileres:", error);
    }
  };

  // Llamar de inmediato la primera vez
  await actualizarPagos();

  // Luego establecer el intervalo
  setInterval(actualizarPagos, 30000);
};

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Estadísticas del dinero en la esquina superior izquierda */}
      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold">${dinero} 💵</h3>
        <p className="text-sm">Experiencia: {experiencia} XP 🚀</p>
        {mensajePago && <p className="text-sm mt-1">{mensajePago} 😊</p>}
      </div>

      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} message={modalMessage} />
      )}

      <h1 className="text-2xl font-bold text-black">Dashboard del Juego</h1>
      <p className="mt-2 text-black font-bold">Bienvenido, {user?.nombre}</p>
      <p className="mt-1 text-black font-bold">Email: {user?.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {propiedades.length > 0 ? (
          propiedades.map((propiedad, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={`/${propiedad.nombre_imagen}`}
                alt={propiedad.nombre}
                className="w-full h-40 object-cover rounded-md"
                onError={(e) => (e.currentTarget.src = "/default.jpg")}
              />
              <h3 className="text-lg font-bold text-black mt-2">{propiedad.nombre}</h3>
              <p className="text-black font-semibold">Nivel: {user?.nivel}</p>
              <p className="text-black font-semibold">Valor: ${propiedad.valor}</p>

              {propiedad.alquilado === 0 && (
                <button 
                  className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  onClick={() => router.push(`/potenciales-inquilinos?propiedadId=${propiedad._id}&usuarioId=${user?.id}`)}
                >
                  Ver potenciales Inquilinos
                </button>
              )}

              <button 
                className="mt-3 ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => {
                  setSelectedPropiedad(propiedad);
                  setShowInfoModal(true);
                }}
              >
                Información
              </button>
              
              <button 
                className="mt-3 ml-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                onClick={() => {
                  setSelectedPropiedad(propiedad);
                  setShowMobiliarioModal(true);
                }}
              >
                Ver Inmobiliario
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No tienes propiedades aún.</p>
        )}
      </div>

      {showInfoModal && selectedPropiedad && (
        <PropertyInfoModal 
          propiedad={selectedPropiedad} 
          userId={user?.id || ""} 
          onClose={() => setShowInfoModal(false)}
        />
      )}

      {showMobiliarioModal && selectedPropiedad && (
        <MobiliarioModal 
          propiedadId={selectedPropiedad._id} 
          userId={user?.id || ""} 
          onClose={() => setShowMobiliarioModal(false)}
        />
      )}
    </div>
  );
}
