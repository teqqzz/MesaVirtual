import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5270/api",
});

//Para toda a requisição com Axios sera enviado o token JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
        const originalRequest = erro.config;

        // Se for 401 e não for a rota de login
        if (
            erro.response?.status === 401 &&
            !originalRequest.url?.includes("/usuario/login")
        ) {
            localStorage.removeItem("token");
            window.location.replace("/funcionario/login");
        }

        return Promise.reject(erro);
    }
);

export default api;