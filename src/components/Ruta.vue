<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed" class="modal-container">
      <q-card class="modal-content">
        <q-card-section class="modal-header" >
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="close-button"/>
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 60vh" class="modal-body">
          <q-input  type="number"  v-model="precio"  label="Precio" class="modal-input" />
          <div class="q-pa modal-input">
            <div class="q-gutter">
              <q-select v-model="horario" :options="options" label="Horario" />
            </div>
          </div>
          <q-input type="text" v-model="origen" label="Origen" class="modal-input"/>
          <q-input type="text" v-model="destino" label="Destino" class="modal-input"/>
        </q-card-section>
        <q-separator />

        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button" />
          <q-btn  flat  label="Guardar 💾"  color="primary"  @click="editarAgregarRuta()" class="action-button"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Tabla -->
    <div  class="container-table"  style="height: 90vh; overflow-y: auto; width: 80%">
      <h1>Rutas</h1>

      <div class="b-b">
        <q-input class="bbuscar" v-model="searchrutas" label="Buscar por Cedula" style="width: 300px" @input="filtraruta" />
        <q-btn color="primary" label="Buscar" @click="filtraruta" class="btnbuscar" />
      </div>

      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar ➕" @click="agregarRuta()" />
      </div>
      <q-table title="Rutas" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green"  >Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn  color="white"  text-color="black"  label="🖋️"  @click="EditarRuta(props.row._id)"/>
            <q-btn  color="white"  text-color="black"  label="❌"  @click="InactivarRuta(props.row._id)"  v-if="props.row.estado == 1"/>
            <q-btn  color="white"  text-color="black"  label="✅"  @click="ActivarRuta(props.row._id)"  v-else/>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
    
  <script setup>
import { ref, onMounted, watch } from "vue";
import { format } from "date-fns";
import { useHorarioStore } from "../stores/Horario.js";
import { useRutaStore } from "../stores/Ruta.js";
import { useQuasar } from "quasar";

const horarioStore = useHorarioStore();
const rutaStore = useRutaStore();
const $q = useQuasar();

let rutas = ref([]);
let rows = ref([]);
let fixed = ref(false);
let options = ref([]);
let text = ref("");
let precio = ref();
let horario = ref("");
let origen = ref("");
let destino = ref("");
let cambio = ref(0);
let searchrutas = ref("");

// Filtar Rutas Por Origen
function filtraruta() {
  if (searchrutas.value.trim() === "") {
    rows.value = rutas.value;
  } else {
    rows.value = rutas.value.filter((rutas) =>rutas.origen.toString().includes(searchrutas.value.toString()));
  };
};

// Obtener Rutas
async function obtenerInfo() {
  try {
    await rutaStore.obtenerInfoRutas();
    rutas.value = rutaStore.rutas;
    rows.value = rutaStore.rutas;
  } catch (error) {
    console.log(error);
  };
};

// Obtener las Opciones de los Horarios
async function obtenerHorarios() {
  try {
    await horarioStore.obtenerInfoHorarios();
    options.value = horarioStore.horarios.map((horario) => ({
      label: `${horario.hora_partida} - ${horario.hora_llegada}`,
      value: String(horario._id),
    }));
  } catch (error) {
    console.log(error);
  };
};

// Primera Accion
onMounted(async () => {
   await obtenerInfo();
});

// Datos tabla 
const columns = [
  { name: "precio", label: "Precio", field: "precio", sortable: true },
  { name: "hora_partida", label: "Hora Partida", field: (row) => row.horario_id.hora_partida,},
  { name: "hora_llegada", label: "Hora LLegada", field: (row) => row.horario_id.hora_llegada,},
  { name: "origen", label: "Origen", field: "origen" },
  { name: "destino", label: "Destino", field: "destino" },
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),},
  { name: "opciones", label: "Opciones", sortable: false },
];

// Agregar Ruta
function agregarRuta() {
  obtenerHorarios();
  fixed.value = true;
  text.value = "Agregar Ruta";
  cambio.value = 0;
};

// Fucionamiento Agregar y Editar Rutas
async function editarAgregarRuta() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await rutaStore.postRuta({
          precio: precio.value,
          horario_id: horario._rawValue.value,
          origen: origen.value,
          destino: destino.value,
        });
  
        limpiar();
        greatMessage.value = "Ruta Agregada";
        showGreat();
        obtenerInfo();
      } catch (error) {
        cancelShow();
        badMessage.value = error.response.data.error.errors[0].msg;
        showBad();
      };
    } else {
      let id = idRuta.value;
      if (id) {
        try {
          showDefault();
          await rutaStore.putEditarRuta(id, {
            precio: precio.value,
            horario_id: horario._rawValue.value,
            origen: origen.value,
            destino: destino.value,
          });
          cancelShow();
          limpiar();
          greatMessage.value = "Ruta Actualizada";
          showGreat();
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          cancelShow();
          badMessage.value = error.response.data.error.errors[0].msg;
          showBad();
        };
      };
    };
    validacion.value = false
  };
};

// Limpiar Casillas
function limpiar() {
  precio.value = "";
  horario.value = "";
  origen.value = "";
  destino.value = "";
};

let idRuta = ref("");
// Editar Rutas
async function EditarRuta(id) {
  obtenerHorarios();
  cambio.value = 1;
  const rutaSelected = rutas.value.find((ruta) => ruta._id === id);
  if (rutaSelected) {
    idRuta.value = String(rutaSelected._id);
    fixed.value = true;
    text.value = "Editar Ruta";
    precio.value = rutaSelected.precio;
    horario.value = {
      label: `${rutaSelected.horario_id.hora_partida} - ${rutaSelected.horario_id.hora_llegada}`,
      value: String(rutaSelected.horario_id._id),
    };
    origen.value = rutaSelected.origen;
    destino.value = rutaSelected.destino;
  }
}

// Inactivar Rutas
async function InactivarRuta(id) {
  try{        
    showDefault();
    await rutaStore.putInactivarRuta(id);
    cancelShow();
    greatMessage.value = "Ruta Inactivada";
    showGreat(); 
    obtenerInfo()
  }catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  };
};

// Activar Rutas
async function ActivarRuta(id) {
  try{        
    showDefault()
    await rutaStore.putActivarRuta(id);
    cancelShow();
    greatMessage.value = "Ruta Activada";
    showGreat();
    obtenerInfo()
  }catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  };
};

let greatMessage = ref("");
let badMessage = ref("");

// Notificacion Buena
const showGreat = () => {
  notification = $q.notify({
    spinner: false,
    message: greatMessage,
    timeout: 2000,
    type: "positive",
  });
};

// Notificacion Mala 
const showBad = () => {
  notification = $q.notify({
    spinner: false,
    message: badMessage,
    timeout: 2000,
    type: "negative",
  });
};


// Notificacion de Carga
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

// Cancelar Notificacion
const cancelShow = ()=>{
  if (notification) {
    notification();
  };
};

let validacion = ref(false);
let notification = ref(null);

// Validar los Campos
function validar() {
  if (!precio.value && !horario.value && !origen.value && !destino.value) {
    badMessage.value = "Por favor rellene los campos";
    showBad();
  } else if (!precio.value) {
    badMessage.value = "Ingrese el Precio";
    showBad();
  } else if (!horario.value) {
    badMessage.value = "Eliga un Horario";
    showBad();
  } else if (!origen.value) {
    badMessage.value = "Digite el Origen";
    showBad();
  }else if(!destino.value){
    badMessage.value = "Digite el Destino";
    showBad();
  } else {
    validacion.value = true;
  };
};

// Limpiar el modal cuando se cierre mal
watch(fixed, () => {
  if (fixed.value == false) {
    limpiar();
  };
});
</script>
    
  <style scoped>
@import url("https://fonts.googleapis.com/css2?family=Gabarito&display=swap");
.container {
  display: flex;
  justify-content: center;
}
.modal-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

.container-table {
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
  justify-content: flex-end;
}

.error{
  display: flex;
  width: 100%;
  justify-content: center;
  color: red;
  font-size: 18px;
  text-align: center;    
}
.b-b {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  gap: 5px;
}

.btnbuscar{
  width:170px;
  height:53px;
  position: relative;
  top: 7px;
}
.bbuscar{
  width: 170px;
  font-size: 18px;
  background-color: rgba(5, 177, 245, 0.204);
  border-radius: 5px;
  position: relative;
  top: 6px;
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #3498db; 
    color: #fff; 
  }

  .close-button {
    color: #fff; 
  }

  .modal-body {
    padding: 20px;
  }

  .modal-input {
    width: 100%;
    margin-bottom: 10px;
  }

  .modal-footer {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .action-button {
    margin-left: 10px;
  }
</style>