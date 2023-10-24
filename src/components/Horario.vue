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
                    <q-input v-model="hora_partida" label="Hora de partida" style="width: 300px;"/>
                    <q-input v-model="hora_llegada" label="Hora de llegada" style="width: 300px;"/>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                    <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarHorario()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div class="container-table">
            <h1>Horario</h1>
            <div class="btn-agregar">
                <q-btn color="secondary" label="Agregar ➕" @click="agregarHorario()" />
            </div>
            <q-table title="Buses" :rows="rows" :columns="columns" row-key="name">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <label for="" v-if="props.row.estado == 1" style="color: green;" >Activo</label>
                        <label for="" v-else style="color: red;">Inactivo</label>

                    </q-td>

                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props" class="botones">
                        <q-btn color="white" text-color="black" label="🖋️" @click="editarHorario(props.row._id)" />
                        <q-btn color="white" text-color="black" label="❌" @click="InactivarHorario(props.row._id)"
                            v-if="props.row.estado == 1" />
                        <q-btn color="white" text-color="black" label="✅" @click="ActivarHorario(props.row._id)" v-else />
                    </q-td>
                </template>
            </q-table>
        </div>

    </div>
</template>
  
<script setup>

import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useHorarioStore } from '../stores/Horario.js';
const horarioStore = useHorarioStore()

let horarios = ref([]);
let rows = ref([]);
let fixed = ref(false)
let text = ref('')
let hora_partida = ref();
let hora_llegada = ref();
let cambio = ref(0)

async function obtenerInfo(){
    try {
        await horarioStore.obtenerInfoHorarios();
        horarios.value = horarioStore.horarios;
        rows.value = horarioStore.horarios;
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    obtenerInfo()
});

const columns = [
    { name: 'hora_partida', label: 'Hora Partida', field: 'hora_partida', sortable: true },
    { name: 'hora_llegada', label: 'Hora Llegada', field: 'hora_llegada', sortable: true },
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

function agregarHorario() {
    fixed.value = true;
    text.value = "Agregar Horario";
    cambio.value = 0
}

async function editarAgregarHorario() {
    if (cambio.value === 0) {
        await horarioStore.postHorario({
            hora_partida: hora_partida.value,
            hora_llegada: hora_llegada.value,
        })
        limpiar() 
        obtenerInfo()

    } else {
        let id = idHorario.value;
        if (id) {
            await horarioStore.putEditarHorario(id,{
                hora_partida: hora_partida.value,
                hora_llegada: hora_llegada.value,
            });
           
            limpiar(); 
            obtenerInfo()
            fixed.value = false;
        }
    }
}


function limpiar() {
    hora_partida.value = ""
    hora_llegada.value = ""

}

let idHorario = ref('')
async function editarHorario(id) {
    cambio.value = 1;
    const horarioSelected = horarios.value.find((horario) => horario._id === id);
    if (horarioSelected) {
        idHorario.value = String(horarioSelected._id);
        fixed.value = true;
        text.value = "Editar Horario";
        hora_partida.value = horarioSelected.hora_partida
        hora_llegada.value = horarioSelected.hora_llegada
    }
}

async function InactivarHorario(id) {
    await horarioStore.putInactivarHorario(id)
    obtenerInfo()
}

async function ActivarHorario(id) {
    await horarioStore.putActivarHorario(id)
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