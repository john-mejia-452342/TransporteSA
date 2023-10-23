import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useConductorStore = defineStore('conductor', () => {
    const conductores = ref([]);

    const obtenerInfoConductores = async () => {
        try {
            let responseConductores= await axios.get('conductor/conductor');
            conductores.value = responseConductores.data.conductor;
            console.log(responseConductores);
        } catch (error) {
            throw error
        }
    };

    const postConductor = async (data) =>{
        try {
            let res = await axios.post("conductor/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarConductor = async (id, data) => {
        try {
            let res = await axios.put(`/conductor/conductor/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    // const putInactivarBus = async (id)=>{
    //     try {
    //         let r = await axios.put(`bus/inactivarBus/${id}`)
    //         return r
    //     } catch (error) {
    //         console.log(error, "Error al cambiar el estado del bus");
    //     }
    // }
    // const putActivarBus = async (id)=>{
    //     try {
    //         let r = await axios.put(`bus/activarBus/${id}`)
    //         return r
    //     } catch (error) {
    //         console.log(error, "Error al cambiar el estado del bus");
    //     }
    // }

    return {
        conductores,
        obtenerInfoConductores, postConductor, putEditarConductor
    };
});