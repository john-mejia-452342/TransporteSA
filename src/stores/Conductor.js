import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useConductorStore = defineStore('conductor', () => {
    const conductores = ref([]);

    const obtenerInfoConductores = async () => {
        try {
            let responseConductores= await axios.get('conductor/conductor');
            conductores.value = responseConductores.data.conductor;
        } catch (error) {
            throw error
        }
    };

    // const postBus = async (data) =>{
    //     try {
    //         let res = await axios.post("bus/bus/agregar", data);
    //         return res
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // const putEditarBus = async (id, data) => {
    //     try {
    //         let res = await axios.put(`bus/bus/${id}`, data);
    //         return res
    //     } catch (error) {
    //         throw error;
    //     }
    // };

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
        obtenerInfoConductores,
    };
});