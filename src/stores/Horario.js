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

    const postHorario = async (data) =>{
        try {
            let res = await axios.post('/horario/agregar', data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarHorario = async (id, data) => {
        try {
            let res = await axios.put(`/horario/horario/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarHorario = async (id)=>{
        try {
            let r = await axios.put(`/horario/inactivarHorario/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del Horario");
        }
    }
    const putActivarHorario = async (id)=>{
        try {
            let r = await axios.put(`/horario/activarHorario/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }

    return {
        horarios,
        obtenerInfoHorarios, postHorario, putEditarHorario, putInactivarHorario, putActivarHorario
    };
});