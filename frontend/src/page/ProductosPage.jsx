

// Hook de estado local (controla que modal esta abierto)
import { useState } from 'react';
// Hook generico de CRUD simulado (lista + agregar + actualizar + alternarEstado)
import useCrudSimulado from '../hooks/useCrudSimulado';
// Datos iniciales por si localStorage todavia no tiene nada guardado
import mockSubcategorias from '../data/mockSubcategorias';
import mockProductos from '../data/mockProductos';
// Modal con el formulario de crear/editar producto
import ProductoFormModal from '../components/productos/ProductoFormModal';
// Modal generico de confirmacion (para activar/desactivar)
import ConfirmModal from '../components/common/ConfirmModal';
// Etiqueta visual de "Activo"/"Inactivo"
import EstadoBadge from '../components/common/EstadoBadge';

// Formatea un numero como pesos colombianos, ej: 2450000 -> "$ 2.450.000"
function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    valor
  );
}

// No recibe props: es el "element" de la ruta /dashboard/productos en App.jsx
function ProductosPage() {
  // "subcategorias" viene de localStorage bajo la clave 'subcategorias'
  const { lista: subcategorias } = useCrudSimulado('subcategorias', mockSubcategorias);
  // "productos" viene de localStorage bajo la clave 'productos'
  const { lista: productos, agregar, actualizar, alternarEstado } = useCrudSimulado('productos', mockProductos);

  // Controla si el modal de crear/editar esta visible
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // Guarda el producto que se esta editando; null = se esta creando uno nuevo
  const [registroEditar, setRegistroEditar] = useState(null);
  // Guarda el id del producto al que se le va a cambiar el estado
  const [idConfirmar, setIdConfirmar] = useState(null);

  // Dado un subcategoriaId, busca el nombre de esa subcategoria para
  // pintarlo en la tabla (simula lo que en SQL seria un JOIN)
  function nombreSubcategoria(subcategoriaId) {
    const subcategoria = subcategorias.find((s) => s.id === subcategoriaId);
    return subcategoria ? subcategoria.nombre : 'Sin subcategoria';
  }

  // Abre el modal en modo "crear" (sin registro previo que cargar)
  function abrirCrear() {
    setRegistroEditar(null);
    setMostrarFormulario(true);
  }

  // Abre el modal en modo "editar", precargando el producto clickeado
  function abrirEditar(producto) {
    setRegistroEditar(producto);
    setMostrarFormulario(true);
  }

  // Se ejecuta cuando el formulario del modal se envia: decide si actualiza
  // un registro existente o agrega uno nuevo, y cierra el modal
  function guardarProducto(datos) {
    if (registroEditar) {
      actualizar(registroEditar.id, datos);
    } else {
      agregar(datos);
    }
    setMostrarFormulario(false);
  }

  // Aplica el cambio de estado confirmado en el ConfirmModal y lo cierra
  function confirmarCambioEstado() {
    alternarEstado(idConfirmar);
    setIdConfirmar(null);
  }

  // Buscamos el producto que se va a activar/desactivar para armar
  // un mensaje de confirmacion mas claro (con su nombre)
  const productoAConfirmar = productos.find((p) => p.id === idConfirmar);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Gestion de productos</h2>
        <button className="btn btn-primary" onClick={abrirCrear}>
          <i className="bi bi-plus-lg me-1"></i>
          Nuevo producto
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Subcategoria</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Recorremos la lista de productos y pintamos una fila por cada uno */}
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td className="text-muted">{nombreSubcategoria(producto.subcategoriaId)}</td>
                  <td>{formatearPrecio(producto.precio)}</td>
                  <td>
                    {/* Si el stock esta en 0, lo resaltamos en rojo */}
                    <span className={producto.stock === 0 ? 'text-danger fw-semibold' : ''}>{producto.stock}</span>
                  </td>
                  <td>
                    <EstadoBadge activo={producto.activo} />
                  </td>
                  <td className="text-end">
                    {/* Editar: abre el modal precargado con este producto */}
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => abrirEditar(producto)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    {/* Activar/desactivar: solo dispara la confirmacion */}
                    <button
                      className={`btn btn-sm ${producto.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => setIdConfirmar(producto.id)}
                    >
                      <i className={`bi ${producto.activo ? 'bi-slash-circle' : 'bi-check-circle'}`}></i>
                    </button>
                  </td>
                </tr>
              ))}

              {/* Si no hay ningun producto en la lista, mostramos un mensaje */}
              {productos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* El modal solo se pinta activo cuando mostrarFormulario es true;
          "subcategorias" alimenta el <select> del formulario */}
      <ProductoFormModal
        mostrar={mostrarFormulario}
        registroEditar={registroEditar}
        subcategorias={subcategorias}
        onGuardar={guardarProducto}
        onCerrar={() => setMostrarFormulario(false)}
      />

      {/* Aparece apenas se hace clic en cualquier boton de activar/desactivar */}
      <ConfirmModal
        mostrar={idConfirmar !== null}
        titulo={productoAConfirmar?.activo ? 'Desactivar producto' : 'Activar producto'}
        mensaje={`¿Seguro que quieres ${productoAConfirmar?.activo ? 'desactivar' : 'activar'} "${productoAConfirmar?.nombre}"?`}
        onConfirmar={confirmarCambioEstado}
        onCancelar={() => setIdConfirmar(null)}
      />
    </div>
  );
}

// Exportamos la pagina para usarla en la ruta /dashboard/productos
export default ProductosPage;
