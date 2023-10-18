import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useHorarioStore = defineStore('horario', () => {
    const horarios = ref([]);

    const obtenerInfoHorarios = async () => {
        try {
            let responseHorario = await axios.get('/horario/horario');
            horarios.value = responseHorario.data.horario; 
        } catch (error) {
            throw error
        }
    };

    // const postCliente = async (data) =>{
    //     try {
    //         let res = await axios.post('/cliente/cliente/agregar', data);
    //         return res
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // const putEditarCliente = async (id, data) => {
    //     try {
    //         let res = await axios.put(`/cliente/cliente/${id}`, data);
    //         return res
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    // const putInactivarCliente = async (id)=>{
    //     try {
    //         let r = await axios.put(`/cliente/inactivarCliente/${id}`)
    //         return r
    //     } catch (error) {
    //         console.log(error, "Error al cambiar el estado del bus");
    //     }
    // }
    // const putActivarCliente = async (id)=>{
    //     try {
    //         let r = await axios.put(`/cliente/activarCliente/${id}`)
    //         return r
    //     } catch (error) {
    //         console.log(error, "Error al cambiar el estado del bus");
    //     }
    // }

    return {
        horarios,
        obtenerInfoHorarios,
    };
});