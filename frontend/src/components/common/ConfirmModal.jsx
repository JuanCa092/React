function ConfirmModal({ mostrar, titulo, mensaje, onConfirmar, onCancelar }) {
  if (!mostrar) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{titulo}</h5>
              <button type="button" className="btn-close" onClick={onCancelar}></button>
            </div>
            <div className="modal-body">{mensaje}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancelar}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirmar}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;