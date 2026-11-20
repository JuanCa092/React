import { act, useEffect } from "react"

function useCurdSimulado(claveStorage, datosIniciales) {
    //estado con la lista de registros el valor inicial calcula
    //una sola vez, si hay datos guardados en localstorage los usa
    //sino arranca con datos iniciales
    const [lista , setlista ] =useStauge (() => {
        const guardado = localStorage.getItem(claveStorage)

        return guardado ? JSON.parse(guardado): datosIniciales
    });

        useEffect(() => {
            localStorage.setItem(claveStorage, JSON.stringify(lista))
        }, [lista, claveStorage ]);

        function agregar (datoNuevoRegistro) {
            setlista((listaActual) => {
                const nuevoId = listaActual.length > 0 ?
                Math.max (...listaActual.map((r) => r.id)) + 1 : 1;
                const registroNuevo = {id: nuevoId, activo: true, ...datoNuevoRegistro};
                return [...listaActual, registroNuevo];
            });
        }
  
    //UPDATE busca el registro por id y le mezcla los campos nuevos
    // dejando el resto igual conserva lo que no se cambia
    function actualizar(id, cambio) {
        setlista((listaActual) => 
        listaActual.map((registro) => (registro.id === id ? {...registro, ...cambio}: registro))
    );
    }

    // DELETE logico no borra el registero de la lista sino lo desactiva en lugar de eliminarlo definitivamente
    function alternarEstado(id) {
        setlista((listaActual) => 
        listaActual.map((registro) => (registro.id === id ? {...registro, activo: !registro.activo}: registro ))
    );
    }

    return {lista, agregar, actualizar, alternarEstado};

}
export default useCurdSimulado;