function EstadoBadge ({ activo }) {
    const clase= activo ? 'badge bg-succes' : 'badge bg-secunday';

    const texto = activo ? 'Activo' : 'Inactivo';
    return <span className={clase}>{texto}</span>;
}

export default EstadoBadge