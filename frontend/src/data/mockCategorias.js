// ============================================================
// mockCategorias.js
// Pertenece a: Clase 06 - CRUD de categorias y subcategorias
// ------------------------------------------------------------
// Datos simulados de categorias de productos. Cada subcategoria
// (ver mockSubcategorias.js) va a apuntar a una de estas categorias
// mediante "categoriaId", simulando una relacion 1-a-muchos como
// la que tendrian dos tablas relacionadas en una base de datos real.
// ============================================================

// Arreglo de objetos: cada objeto es una "fila" simulada de la tabla
const mockCategorias = [
  { id: 1, nombre: 'Tecnologia', descripcion: 'Equipos y accesorios electronicos', activo: true },
  { id: 2, nombre: 'Hogar', descripcion: 'Articulos para el hogar', activo: true },
  { id: 3, nombre: 'Oficina', descripcion: 'Insumos y mobiliario de oficina', activo: false }, // ejemplo ya desactivado
];

// Exportamos el arreglo para usarlo como valor inicial en useCrudSimulado
export default mockCategorias;
