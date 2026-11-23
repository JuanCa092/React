function EstadoBadge ({ activo }) {
    const clase = 'text-dark';

    const texto = activo ? 'Activo' : 'Inactivo';
    return <span className={clase}>{texto}</span>;
}

export default EstadoBadge