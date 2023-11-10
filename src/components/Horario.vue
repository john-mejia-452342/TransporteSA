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
                <q-div class="error">{{errorMessage}}</q-div>
                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                    <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarHorario()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div class="container-table" style="height: 90vh; overflow-y: auto; width: 80%">
            <h1>Horario</h1>
            <div class="btn-agregar">
                <q-btn color="secondary" label="Agregar ➕" @click="agregarHorario()" />
            </div>
            <q-table title="Horarios" :rows="rows" :columns="columns" row-key="name">
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
import { useQuasar } from 'quasar'

const horarioStore = useHorarioStore();
const $q = useQuasar();


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
    limpiar();
    fixed.value = true;
    text.value = "Agregar Horario";
    cambio.value = 0
}

async function editarAgregarHorario() {
    validar();
    if (validacion.value===true) {
        if (cambio.value === 0) {
            try {
                showDefault()
                await horarioStore.postHorario({
                hora_partida: hora_partida.value,
                hora_llegada: hora_llegada.value,
                })
                if(notification) {
                    notification()
                }
                limpiar()
                $q.notify({
                    spinner: false, 
                    message: "Horario Agregado", 
                    timeout: 2000,
                    type: 'positive',
                }); 
            } catch (error) {
                if(notification) {
                    notification()
                };
                $q.notify({
                    spinner: false, 
                    message: `${error.response.data.error.errors[0].msg}`, 
                    timeout: 2000,
                    type: 'negative',
                });
            }
        obtenerInfo()
        } else {
            let id = idHorario.value;
            if (id) {
                try {
                    showDefault()
                    await horarioStore.putEditarHorario(id,{
                    hora_partida: hora_partida.value,
                    hora_llegada: hora_llegada.value,
                    });
                    if(notification) {
                        notification()
                    }
                    limpiar()
                    $q.notify({
                        spinner: false, 
                        message: "Horario Actualizado", 
                        timeout: 2000,
                        type: 'positive',
                    }); 
                     
                    obtenerInfo()
                    fixed.value = false;
                } catch (error) {
                    if(notification) {
                    notification()
                    };
                    $q.notify({
                        spinner: false, 
                        message: `${error.response.data.error.errors[0].msg}`, 
                        timeout: 2000,
                        type: 'negative',
                    });
                }
                
            };
        };
        validacion.value = false  
    };
 
};


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
    try{        
        showDefault()
        await horarioStore.putInactivarHorario(id)
        if(notification) 
            notification()
        
        $q.notify({
            spinner: false, 
            message: "Horario Inactivado", 
            timeout: 2000,
            type: 'positive',
        }); 
        obtenerInfo()
    }catch (error) {
        if(notification) {
            notification()
        };
        $q.notify({
            spinner: false, 
            message: `${error.response.data.error.errors[0].msg}`, 
            timeout: 2000,
            type: 'negative',
        });
    }
    
}

async function ActivarHorario(id) {
    try {
        showDefault()
        await horarioStore.putActivarHorario(id)
        if(notification) 
            notification()
        
        $q.notify({
            spinner: false, 
            message: "Horario Activado", 
            timeout: 2000,
            type: 'positive',
        }); 
        obtenerInfo();
 
    } catch (error) {
        if(notification) {
            notification()
        };
        $q.notify({
            spinner: false, 
            message: `${error.response.data.error.errors[0].msg}`, 
            timeout: 2000,
            type: 'negative',
        });
    }
}

let errorMessage = ref("");

const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: 'Please wait...',
    timeout: 0 
  });
};

let validacion = ref(false);
let notification = ref(null);
async function validar() {

    const timeFormat = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!hora_partida.value && !hora_llegada.value) {
        errorMessage.value = "Ingrese la hora de Partida y Llegada";
    } else if (!hora_partida.value) {
        errorMessage.value = "Ingrese la hora de Partida";
    } else if (!hora_llegada.value) {
        errorMessage.value = "Ingrese la hora de Llegada";
    } else if (!timeFormat.test(hora_partida.value) || !timeFormat.test(hora_llegada.value)) {
        errorMessage.value = "Ingrese las horas en el formato correcto, por ejemplo, 12:00:00 o 09:00:00";
    } else {
        errorMessage.value = ""
        validacion.value = true;
    }   

};


</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Gabarito&display=swap');
.container{
    display: flex;
    justify-content: center;
    min-height: 90vh;
}
.container-table{
    display: flex;
    justify-content: center;
    text-align: center;
    flex-direction: column;
}
.container-table h1 {
    font-family: "Gabarito", sans-serif;
    padding: 0;
    margin: 0;
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
.error{
    display: flex;
    width: 100%;
    justify-content: center;
    color: red;
    font-size: 18px;
    text-align: center;    
}

</style>