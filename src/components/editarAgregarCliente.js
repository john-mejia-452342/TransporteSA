import { validar, validacion, cambio, showDefault, clienteStore, cedula, nombre, telefono, notification, limpiar, $q, obtenerInfo, idCliente, fixed } from './Cliente.vue.js';

export async function editarAgregarCliente() {
validar();
if (validacion.value === true) {
if (cambio.value === 0) {
try {
showDefault();
await clienteStore.postCliente({
cedula: cedula.value,
nombre: nombre.value,
telefono: telefono.value,
});
if (notification) {
notification();
}
limpiar();
$q.notify({
spinner: false,
message: "Bus Agregado",
timeout: 2000,
type: "positive",
});
obtenerInfo();
} catch (error) {
if (notification) {
notification();
}
$q.notify({
spinner: false,
message: `${error.response.data.error.errors[0].msg}`,
timeout: 2000,
type: "negative",
});
}
} else {
let id = idCliente.value;
if (id) {
await clienteStore.putEditarCliente(id, {
cedula: cedula.value,
nombre: nombre.value,
telefono: telefono.value,
});
limpiar();
obtenerInfo();
fixed.value = false;
}
}
}

}
