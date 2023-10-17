<template>
    <div>
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
                    <q-input v-model="placa" label="Placa" style="width: 300px;" v-if="cambio == 0" />
                    <q-input v-model="numero_bus" label="Número de Bus" style="width: 300px;" v-if="cambio == 0" />
                    <q-input v-model="cantidad_asientos" label="Cantidad de Asientos" style="width: 300px;" />
                    <q-input v-model="empresa_asignada" label="Empresa Asignada" style="width: 300px;" />
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                    <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarBus()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div>
            <h1>Buses</h1>
            <div class="btn-agregar">
                <q-btn color="secondary" label="Agregar" @click="agregarBus()" />
            </div>
            <q-table title="Buses" :rows="rows" :columns="columns" row-key="name">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <label for="" >{{ props.estado}}</label>

                    </q-td>

                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props" class="botones">
                        <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
                        <q-btn color="amber" glossy label="❌" @click="InactivarBus(props.row._id)"
                            v-if="props.row.estado == 1" />
                        <q-btn color="amber" glossy label="✅" @click="ActivarBus(props.row._id)" v-else />
                    </q-td>
                </template>
            </q-table>
        </div>

    </div>
</template>
  
<script>
import { ref, onMounted} from 'vue'
import axios from 'axios';
import { format } from 'date-fns';
import {useVendedorStore} from '../stores/Vendedor'


const vendedorstore = useVendedorStore()


let leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}



</script>