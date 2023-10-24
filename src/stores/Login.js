import {defineStore} from 'pinia'
import axios from 'axios'
import {ref} from'vue'

export const useLoginStore = defineStore('Login', ()=>{
    let loading = ref(false)
})