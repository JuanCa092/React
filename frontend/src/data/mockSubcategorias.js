

// Arreglo de objetos: "categoriaId" apunta al "id" de una fila de mockCategorias.js
const mockSubcategorias = [
  { id: 1, nombre: 'Laptops', categoriaId: 1, activo: true },
  { id: 2, nombre: 'Celulares', categoriaId: 1, activo: true },
  { id: 3, nombre: 'Electrodomesticos', categoriaId: 2, activo: true },
  { id: 4, nombre: 'Sillas', categoriaId: 3, activo: false }, // categoria 3 (Oficina) esta inactiva
];

// Exportamos el arreglo para usarlo como valor inicial en useCrudSimulado
export default mockSubcategorias;
