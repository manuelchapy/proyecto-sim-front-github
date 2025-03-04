"use client";

interface WelcomeModalProps {
  onClose: () => void;
  message: string;
}

export default function WelcomeModal({ onClose, message }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-xl font-bold text-black">¡Bienvenido al Juego!</h2>
        <p className="mt-4 text-gray-900 font-semibold">{message}</p> {/* Más oscuro para mejor visibilidad */}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}