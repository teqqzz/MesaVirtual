'use client'

import React, { useEffect, useState } from "react";
import Categoria from "@/types/categoria";
import api from "@/services/axiosAuth";
import useAuth from "@/hooks/useAuth";
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Alert,
    Box,
    Grid,
} from "@mui/material";

function Categorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [nome, setNome] = useState<string>("");
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);

    useAuth();

    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = async () => {
        try {
            setCarregando(true);
            const resposta = await api.get("/categorias");
            setCategorias(resposta.data);
        } catch (error: any) {
            handleApiError(error, "Erro ao carregar categorias.");
        } finally {
            setCarregando(false);
        }
    };

    const criarCategoria = async () => {
        if (!nome) {
            setErro("Preencha o nome da categoria!");
            return;
        }

        try {
            await api.post("/categorias", { nome });
            setNome("");
            carregarCategorias();
        } catch (error: any) {
            handleApiError(error, "Erro ao criar categoria.");
        }
    };

    const editarCategoria = async () => {
        if (!nome || editandoId === null) {
            setErro("Preencha o nome da categoria!");
            return;
        }

        try {
            await api.put(`/categorias/${editandoId}`, { nome });
            setNome("");
            setEditandoId(null);
            carregarCategorias();
        } catch (error: any) {
            handleApiError(error, "Erro ao editar categoria.");
        }
    };

    const excluirCategoria = async (id: number) => {
        if (!window.confirm("Deseja realmente excluir esta categoria?")) return;

        try {
            await api.delete(`/categorias/${id}`);
            carregarCategorias();
        } catch (error: any) {
            handleApiError(error, "Erro ao excluir categoria.");
        }
    };

    const carregarCategoriaParaEditar = async (id: number) => {
        try {
            const resposta = await api.get(`/categorias/${id}`);
            setNome(resposta.data.nome);
            setEditandoId(resposta.data.id);
        } catch (error: any) {
            handleApiError(error, "Erro ao carregar categoria para edição.");
        }
    };

    const handleApiError = (error: any, fallbackMessage: string) => {
        if (error.response?.status === 403) {
            setErro("Você não tem permissão para realizar esta ação, apenas um gerente pode.");
        } else if (error.response?.data?.message) {
            setErro(error.response.data.message);
        } else {
            setErro(fallbackMessage);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Gerenciamento de Categorias
            </Typography>

            {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {editandoId ? "Editar Categoria" : "Nova Categoria"}
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{xs: 12, sm: 8}}>
                        <TextField
                            fullWidth
                            label="Nome da Categoria"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 4}}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={editandoId ? editarCategoria : criarCategoria}
                            >
                                {editandoId ? "Salvar" : "Adicionar"}
                            </Button>
                            {editandoId && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        setEditandoId(null);
                                        setNome("");
                                        setErro(null);
                                    }}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h6" gutterBottom>
                Lista de Categorias
            </Typography>

            {carregando ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Criado Em</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categorias.map((categoria) => (
                                <TableRow key={categoria.id}>
                                    <TableCell>{categoria.id}</TableCell>
                                    <TableCell>{categoria.nome}</TableCell>
                                    <TableCell>
                                        {new Date(categoria.criadoEm).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() =>
                                                    carregarCategoriaParaEditar(categoria.id)
                                                }
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => excluirCategoria(categoria.id)}
                                            >
                                                Excluir
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Container>
    );
}

export default Categorias;
