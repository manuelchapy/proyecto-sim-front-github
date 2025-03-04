export interface Propiedad {
    _id: string;
    nombre: string;
    valor: number;
    nombre_imagen: string; // ✅ Asegúrate de que este campo esté definido
    alquilado: number;
    mobiliario: {
      _id: string;
      nombre: string;
      precio: number;
    }[];
  }