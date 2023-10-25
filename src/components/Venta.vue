<template>
    <div class="container">
         <!-- Modal -->
        <q-dialog v-model="fixed">
            <q-card class="modal-content">
            <q-card-section class="row items-center q-pb-none" style="color: black">
                <div class="text-h6">{{ text }}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
                <div class="q-pa" style="width: 300px;">
                    <div class="q-gutter">
                        <q-select v-model="ruta" :options="optionsRutas" label="Rutas"/> 
                    </div>
                </div>
                <div class="q-pa" style="width: 300px;">
                    <div class="q-gutter">
                        <q-select v-model="bus" :options="optionsBuses" label="Buses"/> 
                    </div>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="primary" v-close-popup />
                <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarBus()"/>
            </q-card-actions>
            </q-card>
        </q-dialog>
        <q-btn color="primary" label="Generar Ticket" @click="generarTicket()"/>
        <div class="container-asientos">
            <div class="container-bus">
                <h3></h3>
                <button type="">💺</button>
            </div>
        </div>
   </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { format } from "date-fns";
import { useBusStore } from "../stores/Bus.js";
import { useConductorStore } from "../stores/Conductor.js"
import { useRutaStore } from "../stores/Ruta.js";

const busStore = useBusStore()
const rutaStore = useRutaStore()
const conductorStore = useConductorStore()

let fixed = ref(false)
let text = ref("")
let ruta = ref("")
let bus = ref("")

let buses = ref([])
let rutas = ref([])
let cosas = ref([])

let optionsRutas = ref([])
let optionsBuses = ref([])

async function obtenerInfo(){
    await busStore.obtenerInfoBuses()
    buses.value = busStore.buses

    await rutaStore.obtenerInfoRutas()
    rutas.value = rutaStore.rutas
}

async function obtenerRutas() {
    try {
        await rutaStore.obtenerInfoRutas();
        optionsRutas.value = rutaStore.rutas.map((ruta) => (
        {
            label: `${ruta.precio} - ${ruta.origen} - ${ruta.destino}`,
            value: String(ruta._id)
        }));
    } catch (error) {
      console.log(error);
    }
}

async function obtenerBuses() {
    const busesFiltrados = buses.value.filter((bus) => bus.ruta_id._id === ruta.value);
    optionsBuses.value = busesFiltrados.map((bus) => ({
      label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
      value: String(bus._id)
    }));
}

async function generarTicket() {
    await obtenerRutas();
    fixed.value = true;
    text.value = "Generar Ticket"; 
    if (obtenerRutas()) {
       await obtenerBuses();
   
    } 
    
    
}

watch(ruta, () => {
    console.log(ruta.value.value);
});
watch(buses,()=>{
    console.log(buses.value[0].ruta_id._id);
})

onMounted(async () => {
  obtenerInfo();
});
</script>

<style scoped>

</style>