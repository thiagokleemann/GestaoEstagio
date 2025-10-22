import axios from "axios";

// 1. Criar uma instância do axios
const instance = axios.create({
    // 2. Definir a baseURL diretamente na criação da instância
    baseURL: process.env.VUE_APP_SCE_API, 
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json", 
    },
});

// 3. Opcional: Interceptadores (se precisar)
// instance.interceptors.request.use(...)

// 4. Exportar a instância configurada
export default instance;

// 5. IMPORTANTE: Definir também a baseURL padrão global
// Garantir que axios.defaults.baseURL tenha o valor correto
if (process.env.VUE_APP_SCE_API) {
    axios.defaults.baseURL = process.env.VUE_APP_SCE_API;
    console.log(`Axios baseURL definida como: ${axios.defaults.baseURL}`); // Log para confirmar
} else {
    console.error("VUE_APP_SCE_API não está definida no .env do frontend!");
    axios.defaults.baseURL = 'http://localhost:3000'; // Fallback
    console.warn(`Axios baseURL usando fallback: ${axios.defaults.baseURL}`); // Log para confirmar fallback
}