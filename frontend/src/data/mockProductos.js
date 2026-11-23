
// Arreglo de objetos: "subcategoriaId" apunta al "id" de una fila de mockSubcategorias.js
const mockProductos = [
  { id: 1, nombre: 'Laptop Lenovo IdeaPad 3', subcategoriaId: 1, precio: 2450000, stock: 12, activo: true },
  { id: 2, nombre: 'iPhone 13', subcategoriaId: 2, precio: 3200000, stock: 5, activo: true },
  { id: 3, nombre: 'Licuadora Oster', subcategoriaId: 3, precio: 185000, stock: 20, activo: true },
  { id: 4, nombre: 'Silla ergonomica', subcategoriaId: 4, precio: 420000, stock: 0, activo: false }, // sin stock y desactivado
];

// Exportamos el arreglo para usarlo como valor inicial en useCrudSimulado
export default mockProductos;
