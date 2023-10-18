<template>
    <div class="container">
        <!-- Modal -->
        <q-dialog v-model="fixed">
            <q-card class="modal-content">
                <q-card-section class="row items-center q-pb-none" style="color: black;">
                    <div class="text-h6">{{ text }}</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                    <q-input v-model="cedula" label="Cedula" style="width: 300px;"/>
                    <q-input v-model="nombre" label="Nombre" style="width: 300px;"/>
                    <q-input v-model="telefono" label="Telefono" style="width: 300px;" />
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                    <q-btn flat label="Guardar 💾" color="primary" @click="editaragregarCliente()" />
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
                        <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
                        <q-btn color="white" text-color="black" label="❌" @click="InactivarBus(props.row._id)"
                            v-if="props.row.estado == 1" />
                        <q-btn color="white" text-color="black" label="✅" @click="ActivarBus(props.row._id)" v-else />
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
let cedula = ref('');
let nombre = ref();
let telefono = ref('');
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
    text.value = "Agregar Bus";
    cambio.value = 0
}

async function editaragregarCliente() {
    if (cambio.value === 0) {
        await clienteStore.postBus({
            placa: placa.value,
            numero_bus: numero_bus.value,
            cantidad_asientos: cantidad_asientos.value,
            empresa_asignada: empresa_asignada.value,
        })
        limpiar() 
        obtenerInfo()

    } else {
        let id = idBus.value;
        if (id) {
            await clienteStore.putEditarBus(id,{
                placa: placa.value,
                numero_bus: numero_bus.value,
                cantidad_asientos: cantidad_asientos.value,
                empresa_asignada: empresa_asignada.value,
            });
           
            limpiar(); 
            obtenerInfo()
            fixed.value = false;
        }
    }
}


function limpiar() {
    placa.value = ""
    numero_bus.value = ""
    cantidad_asientos = ""
    empresa_asignada = ""
}

let idBus = ref('')
async function EditarBus(id) {
    cambio.value = 1;
    const busSeleccionado = buses.value.find((bus) => bus._id === id);
    if (busSeleccionado) {
        idBus.value = String(busSeleccionado._id);
        fixed.value = true;
        text.value = "Editar Bus";
        placa.value = busSeleccionado.placa;
        numero_bus.value = busSeleccionado.numero_bus
        cantidad_asientos.value = busSeleccionado.cantidad_asientos;
        empresa_asignada.value = busSeleccionado.empresa_asignada;
    }
}

async function InactivarCliente(id) {
    await clienteStore.putInactivarCliente(id)
    obtenerInfo()
}

async function ActivarCliente(id) {
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