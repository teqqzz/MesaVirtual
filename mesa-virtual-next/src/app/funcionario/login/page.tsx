"use client";

import api from "@/services/axiosAuth";
import Usuario from "@/types/usuario";
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    const router = useRouter();

    async function efetuarLogin(e: React.FormEvent) {
        e.preventDefault();
        setErro(null); // limpa erro anterior

        const usuario: Partial<Usuario> = { email, senha };

        try {
            const resposta = await api.post("/usuario/login", usuario);
            localStorage.setItem("token", resposta.data.token);
            router.push("/funcionario/itens");
        } catch (erro: any) {
            console.error(erro);
            if (erro.response?.status === 401) {
                setErro("E-mail ou senha incorretos.");
            } else {
                setErro("Erro ao realizar login. Tente novamente.");
            }
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Login
                </Typography>

                {erro && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {erro}
                    </Alert>
                )}

                <Box component="form" onSubmit={efetuarLogin}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="E-mail"
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Senha"
                        type="password"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default Login;
