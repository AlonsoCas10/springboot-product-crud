// =====================================================
// VARIABLE PARA SABER SI ESTAMOS EDITANDO
// =====================================================

let idEditando = null;

const form =
    document.getElementById("formProducto");


// =====================================================
// AL ABRIR LA PÁGINA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarProductos();
        cargarCategorias();

    }
);


// =====================================================
// GUARDAR / ACTUALIZAR
// =====================================================

form.addEventListener("submit", function (event) {

    event.preventDefault();


    const nombre =
        document.getElementById("nombre").value;


    const precio =
        parseFloat(
            document.getElementById("precio").value
        );


    // =================================================
    // OBTENER CATEGORÍA
    // =================================================

    const categoriaId =
        document.getElementById("categoria").value;

        console.log("CATEGORIA SELECCIONADA:", categoriaId);

    // =================================================
    // VALIDAR CATEGORÍA
    // =================================================

    if (categoriaId === "") {

        mostrarMensaje(
            "Debes seleccionar una categoría"
        );

        return;
    }


    // =================================================
    // CREAR OBJETO PRODUCTO
    // =================================================

    const producto = {

        nombre: nombre,

        precio: precio,

        categoria: {

            id: parseInt(categoriaId)

        }
    };
    console.log("PRODUCTO QUE SE ENVIA:" , producto)

    console.log(
        "ID CATEGORIA ENVIADO:",
        producto.categoria.id
    );

    // =================================================
    // CREAR
    // =================================================

    if (idEditando === null) {

        fetch("/productos", {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(producto)

        })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Error HTTP: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(data => {

            mostrarMensaje(
                "Producto guardado correctamente"
            );

            form.reset();

            cargarProductos();

        })

        .catch(error => {

            mostrarMensaje(
                "Error al guardar: " +
                error.message
            );

        });

    }


    // =================================================
    // ACTUALIZAR
    // =================================================

    else {

        fetch(
            `/productos/${idEditando}`,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(producto)

            }
        )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Error HTTP: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(data => {

            mostrarMensaje(
                "Producto actualizado correctamente"
            );

            cancelarEdicion();

            cargarProductos();

        })

        .catch(error => {

            mostrarMensaje(
                "Error al actualizar: " +
                error.message
            );

        });

    }

});


// =====================================================
// LISTAR PRODUCTOS
// =====================================================

function cargarProductos() {

    fetch("/productos")
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    "Error HTTP: " +
                    response.status
                );
            }

            return response.json();
        })

        .then(data => {
            const tabla =
                document.getElementById(
                    "tablaProductos"
                );
            tabla.innerHTML = "";

            data.forEach(producto => {
                const fila =
                    document.createElement("tr");

                // =================================================
                // ID
                // =================================================

                const tdId =
                    document.createElement("td");

                tdId.textContent =
                    producto.id;


                // =================================================
                // NOMBRE
                // =================================================

                const tdNombre =
                    document.createElement("td");

                tdNombre.textContent =
                    producto.nombre;


                // =================================================
                // PRECIO
                // =================================================

                const tdPrecio =
                    document.createElement("td");

                tdPrecio.textContent =
                    producto.precio;


                // =================================================
                // CATEGORÍA
                // =================================================

                const tdCategoria =
                    document.createElement("td");

                tdCategoria.textContent =
                    producto.categoria
                        ? producto.categoria.nombre : "Sin categoria";


                // =================================================
                // ACCIONES
                // =================================================

                const tdAcciones =
                    document.createElement("td");


                // =================================================
                // BOTÓN EDITAR
                // =================================================

                const botonEditar =
                    document.createElement("button");

                botonEditar.textContent =
                    "Editar";


                botonEditar.onclick =
                    function () {

                        editarProducto(

                            producto.id,

                            producto.nombre,

                            producto.precio,

                            producto.categoria
                                ? producto.categoria.id
                                :""

                        );

                    };


                // =================================================
                // BOTÓN ELIMINAR
                // =================================================

                const botonEliminar =
                    document.createElement("button");

                botonEliminar.textContent =
                    "Eliminar";


                botonEliminar.onclick =
                    function () {

                        eliminarProducto(
                            producto.id
                        );

                    };


                // =================================================
                // AGREGAR BOTONES
                // =================================================

                tdAcciones.appendChild(
                    botonEditar
                );


                tdAcciones.appendChild(
                    botonEliminar
                );


                // =================================================
                // ARMAR FILA
                // =================================================

                fila.appendChild(
                    tdId
                );


                fila.appendChild(
                    tdNombre
                );


                fila.appendChild(
                    tdPrecio
                );


                fila.appendChild(
                    tdCategoria
                );


                fila.appendChild(
                    tdAcciones
                );


                tabla.appendChild(
                    fila
                );

            });

        })

        .catch(error => {

            mostrarMensaje(
                "Error al cargar productos: " +
                error.message
            );

        });

}


// =====================================================
// EDITAR
// =====================================================

function editarProducto(
    id,
    nombre,
    precio,
    categoriaId
) {


    // =================================================
    // SELECCIONAR CATEGORÍA
    // =================================================

    document.getElementById(
        "categoria"
    ).value = categoriaId;


    // =================================================
    // GUARDAR ID DEL PRODUCTO
    // =================================================

    idEditando = id;


    // =================================================
    // PONER DATOS EN EL FORMULARIO
    // =================================================

    document.getElementById(
        "nombre"
    ).value = nombre;


    document.getElementById(
        "precio"
    ).value = precio;


    // =================================================
    // CAMBIAR TÍTULO
    // =================================================

    document.getElementById(
        "tituloFormulario"
    ).innerText =
        "Editar Producto";


    // =================================================
    // CAMBIAR BOTÓN
    // =================================================

    document.getElementById(
        "btnGuardar"
    ).innerText =
        "Actualizar";


    // =================================================
    // MOSTRAR CANCELAR
    // =================================================

    document.getElementById(
        "btnCancelar"
    ).style.display =
        "inline-block";

}


// =====================================================
// CANCELAR EDICIÓN
// =====================================================

function cancelarEdicion() {

    idEditando = null;


    form.reset();


    // =================================================
    // RESTAURAR TÍTULO
    // =================================================

    document.getElementById(
        "tituloFormulario"
    ).innerText =
        "Registrar Producto";


    // =================================================
    // RESTAURAR BOTÓN
    // =================================================

    document.getElementById(
        "btnGuardar"
    ).innerText =
        "Guardar";


    // =================================================
    // OCULTAR CANCELAR
    // =================================================

    document.getElementById(
        "btnCancelar"
    ).style.display =
        "none";

}


// =====================================================
// ELIMINAR
// =====================================================

function eliminarProducto(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar el producto?"
        );


    if (!confirmar) {

        return;

    }


    fetch(
        `/productos/${id}`,
        {

            method: "DELETE"

        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Error HTTP: " +
                response.status
            );

        }

        return response.text();

    })

    .then(data => {

        mostrarMensaje(
            "Producto eliminado correctamente"
        );

        cargarProductos();

    })

    .catch(error => {

        mostrarMensaje(
            "Error al eliminar: " +
            error.message
        );

    });

}


// =====================================================
// MOSTRAR MENSAJE
// =====================================================

function mostrarMensaje(texto) {

    document.getElementById(
        "mensaje"
    ).innerText = texto;

}


// =====================================================
// BUSCAR PRODUCTOS
// =====================================================

const buscador =
    document.getElementById(
        "buscarProducto"
    );


console.log(
    "Buscador encontrado:",
    buscador
);


buscador.addEventListener(
    "input",
    function () {

        console.log(
            "ESCRIBIENDO EN EL BUSCADOR"
        );


        const texto =
            buscador.value.toLowerCase();


        console.log(
            "Texto:",
            texto
        );


        const filas =
            document.querySelectorAll(
                "#tablaProductos tr"
            );


        console.log(
            "Filas encontradas:",
            filas.length
        );


        filas.forEach(
            function (fila) {

                const nombre =
                    fila.children[1]
                        .textContent
                        .toLowerCase();


                console.log(
                    "Producto:",
                    nombre
                );


                if (
                    nombre.includes(texto)
                ) {

                    fila.style.display =
                        "";

                } else {

                    fila.style.display =
                        "none";

                }

            }
        );

    }
);


// =====================================================
// CARGAR CATEGORÍAS
// =====================================================

function cargarCategorias() {

    fetch("/categorias")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Error HTTP: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(data => {

            const select =
                document.getElementById(
                    "categoria"
                );


            data.forEach(
                categoria => {

                    const opcion =
                        document.createElement(
                            "option"
                        );


                    opcion.value =
                        categoria.id;


                    opcion.textContent =
                        categoria.nombre;


                    select.appendChild(
                        opcion
                    );

                }
            );

        })

        .catch(error => {

            console.error(
                "Error al cargar categorías:",
                error
            );

        });

}