'use client'

import React, { useState, useEffect } from "react";
import { API_URL } from "@/utils/apiUrl";
import Item from "@/types/item";
import Categoria from "@/types/categoria";
import useAuth from "@/hooks/useAuth";
import api from "@/services/axiosAuth";
import {
    Container,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Box,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';

function Itens() {
    const [itens, setItens] = useState<Item[]>([]);
    const [nome, setNome] = useState<string>("");
    const [descricao, setDescricao] = useState<string>("");
    const [preco, setPreco] = useState<number | string>("");
    const [categoriaId, setCategoriaId] = useState<number | string>("");
    const [imagem, setImagem] = useState<File | null>(null);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    useAuth(); // Verifica se o usuário está logado

    useEffect(() => {
        carregarItens();
        carregarCategorias();
    }, []);

    const carregarItens = async () => {
        try {
            setCarregando(true);
            const resposta = await api.get(`/itens`);
            setItens(resposta.data);
        } catch (error) {
            setErro("Erro ao carregar itens.");
        } finally {
            setCarregando(false);
        }
    };

    const carregarCategorias = async () => {
        try {
            const resposta = await api.get(`/categorias`);
            setCategorias(resposta.data);
        } catch (error) {
            setErro("Erro ao carregar categorias.");
        }
    };

    const criarOuEditarItem = async () => {
        if (!editandoId) {
            if (!nome || !preco || !categoriaId || !imagem) {
                setErro("Preencha todos os campos obrigatórios, incluindo a imagem!");
                return;
            }
        } else {
            if (!nome || !preco || !categoriaId) {
                setErro("Preencha todos os campos obrigatórios!");
                return;
            }
        }

        setErro(null); // Limpa erros anteriores

        try {
            const formData = new FormData();
            formData.append("nome", nome);
            formData.append("descricao", descricao);
            formData.append("preco", preco.toString());
            formData.append("categoriaId", categoriaId.toString());
            if (imagem) {
                formData.append("imagem", imagem);
            }

            const url = editandoId
                ? `/itens/${editandoId}`
                : `/itens`;
            const method = editandoId ? "put" : "post";

            const resposta = await api.request({
                url,
                method,
                data: formData,
            });

            if (resposta.status !== 200 && resposta.status !== 201 && resposta.status !== 204) {
                throw new Error("Erro ao salvar item.");
            }

            limparFormulario();
            carregarItens();
        } catch (error: any) {
            if (error.response?.data?.message) {
                setErro(error.response.data.message);
            } else {
                setErro("Erro ao salvar item.");
            }
        }
    };


    const deletarItem = async (id: number) => {
        if (!window.confirm("Deseja realmente excluir este item?")) return;

        setErro(null); // Limpa erros anteriores

        try {
            await api.delete(`/itens/${id}`);
            carregarItens();
        } catch (error: any) {
            if (error.response?.status === 403) {
                setErro("Você não tem permissão para excluir itens, apenas o gerente.");
            } else if (error.response?.data?.message) {
                setErro(error.response.data.message);
            } else {
                setErro("Erro ao excluir item.");
            }
        }
    };

    const carregarItemParaEditar = (item: Item) => {
        setNome(item.nome);
        setDescricao(item.descricao || "");
        setPreco(item.preco);
        setCategoriaId(item.categoriaId);
        setEditandoId(item.id);
        setImagem(null); // Limpa a imagem ao carregar para edição
    };

    const limparFormulario = () => {
        setNome("");
        setDescricao("");
        setPreco("");
        setCategoriaId("");
        setImagem(null);
        setEditandoId(null);
        setErro(null); // Limpa erros ao limpar o formulário
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Gerenciamento de Itens
            </Typography>

            {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {editandoId ? "Editar Item" : "Novo Item"}
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            margin="normal"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Preço"
                            type="number"
                            value={preco === "" ? "" : preco}
                            onChange={(e) => setPreco(e.target.value)}
                            margin="normal"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }} >
                        <TextField
                            fullWidth
                            label="Descrição"
                            multiline
                            rows={3}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            margin="normal"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="categoria-label">Categoria</InputLabel>
                            <Select
                                labelId="categoria-label"
                                value={categoriaId}
                                label="Categoria"
                                onChange={(e) => setCategoriaId(e.target.value as number)}
                            >
                                <MenuItem value="">
                                    <em>Selecione uma Categoria</em>
                                </MenuItem>
                                {categorias.map((categoria) => (
                                    <MenuItem key={categoria.id} value={categoria.id}>
                                        {categoria.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel shrink htmlFor="upload-image">
                                Imagem
                            </InputLabel>
                            <InputLabel htmlFor="upload-image" sx={{ mb: 1 }} /> {/* Small adjustment for label spacing */}
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ mt: 2 }}
                            >
                                {imagem ? imagem.name : "Carregar Imagem"}
                                <input
                                    type="file"
                                    hidden
                                    id="upload-image"
                                    onChange={(e) => setImagem(e.target.files ? e.target.files[0] : null)}
                                />
                            </Button>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={criarOuEditarItem}
                            >
                                {editandoId ? "Salvar Alterações" : "Adicionar Item"}
                            </Button>
                            {editandoId && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={limparFormulario}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h5" component="h2" gutterBottom>
                Lista de Itens
            </Typography>
            {carregando ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                    <Typography variant="h5">Carregando...</Typography>
                </Box>
            ) : (
                <Paper elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Preço</TableCell>
                                <TableCell>Categoria</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itens.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Nenhum item encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                itens.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.nome}</TableCell>
                                        <TableCell>R${item.preco.toFixed(2)}</TableCell>
                                        <TableCell>{item.categoria?.nome || 'N/A'}</TableCell>
                                        <TableCell>{item.descricao}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                onClick={() => carregarItemParaEditar(item)}
                                                sx={{ mr: 1 }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => deletarItem(item.id)}
                                            >
                                                Excluir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Container>
    );
}

export default Itens;