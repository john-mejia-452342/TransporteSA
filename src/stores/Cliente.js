import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useClienteStore = defineStore('cliente', () => {
    const clientes = ref([]);

    const obtenerInfoClientes = async () => {
        try {
            let responseClientes = await axios.get('/cliente/cliente');
            clientes.value = responseClientes.data.clientes; 
        } catch (error) {
            throw error
        }
    };

    const postBus = async (data) =>{
        try {
            let res = await axios.post("bus/bus/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarBus = async (id, data) => {
        try {
            let res = await axios.put(`bus/bus/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarBus = async (id)=>{
        try {
            let r = await axios.put(`bus/inactivarBus/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }
    const putActivarBus = async (id)=>{
        try {
            let r = await axios.put(`bus/activarBus/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }

    return {
        clientes,
        obtenerInfoClientes,
    };
});