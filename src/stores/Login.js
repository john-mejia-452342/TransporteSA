import {defineStore} from 'pinia'
import axios from 'axios'
import {ref} from'vue'

export const useLoginStore = defineStore('Login', ()=>{
    let loading = ref(false)

    const inicio = async(cuenta, clave) =>{
        try {
            loading.value = true
            let login = await axios.post(`vendedor/vendedor_datos`, {
                cuenta:cuenta,clave:clave
            });
            return login
        } catch (error) {
            loading.value = false
            throw error
        }
    }
})