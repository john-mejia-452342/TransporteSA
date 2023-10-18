<template>
    <div class="container">
        <!-- Modal -->
        <q-dialog v-model="fixed">
            <q-card class="modal-content">
                <q-card-section class="row items-center q-pb-none" style="color: black;">
                    <div class="text-h6">{{ text }}</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup/>
                </q-card-section>
                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                    <q-input type="number" v-model="cedula" label="Cedula" style="width: 300px;"/>
                    <q-input v-model="nombre" label="Nombre" style="width: 300px;"/>
                    <q-input type="number" v-model="telefono" label="Telefono" style="width: 300px;" />
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                    <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarCliente()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div class="container-table">
            <h1>Clientes</h1>
            <div class="btn-agregar">
                <q-btn color="secondary" label="Agregar ➕" @click="agregarCliente()" />
            </div>
            <q-table title="Clientes" :rows="rows" :columns="columns" row-key="name">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <label for="" v-if="props.row.estado == 1" style="color: green;" >Activo</label>
                        <label for="" v-else style="color: red;">Inactivo</label>

                    </q-td>

                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props" class="botones">
                        <q-btn color="white" text-color="black" label="🖋️" @click="editarCliente(props.row._id)" />
                        <q-btn color="white" text-color="black" label="❌" @click="inactivarCliente(props.row._id)"
                            v-if="props.row.estado == 1" />
                        <q-btn color="white" text-color="black" label="✅" @click="activarCliente(props.row._id)" v-else />
                    </q-td>
                </template>
            </q-table>
        </div>

    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useClienteStore } from '../stores/Cliente.js';
const clienteStore = useClienteStore()

let clientes = ref([]);
let rows = ref([]);
let fixed = ref(false)
let text = ref('')
let cedula = ref();
let nombre = ref();
let telefono = ref();
let cambio = ref(0)

async function obtenerInfo(){
    try {
        await clienteStore.obtenerInfoClientes();
        clientes.value = clienteStore.clientes;
        rows.value = clienteStore.clientes;
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    obtenerInfo()
});

const columns = [
    { name: 'cedula', label: 'Cedula', field: 'cedula', sortable: true },
    { name: 'nombre', label: 'Nombre', field: 'nombre', sortable: true },
    { name: 'telefono', label: 'Telefono', field: 'telefono' },
    { name: 'estado', label: 'Estado', field: 'estado', sortable: true},
    {
        name: 'createAT', label: 'Fecha de Creación', field: 'createAT', sortable: true,
        format: (val) => format(new Date(val), 'yyyy-MM-dd')
    },
    {
        name: 'opciones', label: 'Opciones',
        field: row => null,
        "sortable": false,
    },
];

function agregarCliente() {
    fixed.value = true;
    text.value = "Agregar Cliente";
    cambio.value = 0
}

async function editarAgregarCliente() {
    if (cambio.value === 0) {
        await clienteStore.postCliente({
            cedula: cedula.value,
            nombre: nombre.value,
            telefono: telefono.value,
        })
        limpiar() 
        obtenerInfo()

    } else {
        let id = idCliente.value;
        if (id) {
            await clienteStore.putEditarCliente(id,{
                cedula: cedula.value,
                nombre: nombre.value,
                telefono: telefono.value,
            });
            limpiar(); 
            obtenerInfo()
            fixed.value = false;
        }
    }
}


function limpiar() {
    cedula.value = ""
    nombre.value = ""
    telefono.value = ""
}

let idCliente= ref('')
async function editarCliente(id) {
    cambio.value = 1;
    const clienteSeleccionado = clientes.value.find((cliente) => cliente._id === id);
    if (clienteSeleccionado) {
        idCliente.value = String(clienteSeleccionado._id);
        fixed.value = true;
        text.value = "Editar Cliente";
        cedula.value = clienteSeleccionado.cedula;
        nombre.value = clienteSeleccionado.nombre
        telefono.value = clienteSeleccionado.telefono;
    }
}

async function inactivarCliente(id) {
    console.log(id);
    await clienteStore.putInactivarCliente(id)
    obtenerInfo()
}

async function activarCliente(id) {
    await clienteStore.putActivarCliente(id)
    obtenerInfo()
}


</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Gabarito&display=swap');
.container{
    display: flex;
    justify-content: center;
}
.container-table{
    display: flex;
    justify-content: center;
    text-align: center;
    flex-direction: column;
}
.container-table h1{
    font-family: 'Gabarito', sans-serif;
}
.modal-content {
    width: 400px;
}

.botones button {
    margin: 2px;
}

.btn-agregar {
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    justify-content: flex-end
}

</style>