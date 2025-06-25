'use client'

import { useEffect, useState } from "react";
import { API_URL } from "@/utils/apiUrl";
import Item from "@/types/item";
import Pedido from "@/types/pedido";
import DetalhePedido from "@/types/detalhePedido";
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Box,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardActions,
    Divider,
} from '@mui/material';

function CriarPedido() {
    const [itens, setItens] = useState<Item[]>([]);
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [detalhesPedido, setDetalhesPedido] = useState<DetalhePedido[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [nomeCliente, setNomeCliente] = useState("");
    const [numeroMesa, setNumeroMesa] = useState<number | string>("");
    const [quantidades, setQuantidades] = useState<{ [itemId: number]: number }>(
        {}
    );
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    // Carrega os itens ao montar o componente
    useEffect(() => {
        const fetchItens = async () => {
            try {
                setCarregando(true);
                const res = await fetch(`${API_URL}/itens`);
                if (!res.ok) {
                    throw new Error("Erro ao carregar itens.");
                }
                const dados = await res.json();
                setItens(dados);
            } catch (error: any) {
                setErro(error.message || "Erro desconhecido ao carregar itens.");
            } finally {
                setCarregando(false);
            }
        };
        fetchItens();
    }, []);

    // Atualiza o total do pedido quando os detalhes do pedido mudam
    useEffect(() => {
        if (pedido) {
            const fetchTotal = async () => {
                try {
                    const res = await fetch(`${API_URL}/pedidos/${pedido.id}/total`);
                    if (!res.ok) {
                        throw new Error("Erro ao calcular o total.");
                    }
                    const valor = await res.json();
                    setTotal(valor);
                } catch (error: any) {
                    setErro(error.message || "Erro ao calcular o total.");
                }
            };
            fetchTotal();
        }
    }, [pedido, detalhesPedido]);

    // Função para criar um pedido
    const criarPedido = async () => {
        if (!nomeCliente || !numeroMesa) {
            setErro("Por favor, preencha o nome do cliente e o número da mesa.");
            return;
        }
        setErro(null); // Clear previous errors

        try {
            const res = await fetch(`${API_URL}/pedidos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomeCliente,
                    numeroMesaCliente: Number(numeroMesa),
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erro ao criar pedido.");
            }
            const novoPedido = await res.json();
            setPedido(novoPedido);
        } catch (error: any) {
            setErro(error.message || "Erro ao criar pedido.");
        }
    };

    // Função para adicionar um detalhe ao pedido
    const adicionarDetalhe = async (itemId: number) => {
        if (!pedido) {
            setErro("Por favor, crie o pedido antes de adicionar itens.");
            return;
        }
        setErro(null); // Clear previous errors

        const quantidade = quantidades[itemId] || 1;

        try {
            const res = await fetch(`${API_URL}/pedidos/adicionar-detalhe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pedidoId: pedido.id,
                    itemId,
                    quantidade,
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erro ao adicionar item ao pedido.");
            }
            const novoDetalhe = await res.json();
            setDetalhesPedido(novoDetalhe);
            setQuantidades((prev) => ({ ...prev, [itemId]: 1 })); // Reseta a quantidade para 1
        } catch (error: any) {
            setErro(error.message || "Erro ao adicionar item ao pedido.");
        }
    };

    // Chamar o garçom
    const chamarGarcom = async () => {
        if (!pedido) {
            setErro("Por favor, crie o pedido antes de chamar o garçom.");
            return;
        }
        setErro(null); // Clear previous errors

        try {
            const res = await fetch(`${API_URL}/pedidos/${pedido.id}/chamar-garcom`, {
                method: "PUT",
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erro ao chamar o garçom.");
            }
            alert("Garçom chamado com sucesso!"); // Using native alert for simple confirmation
        } catch (error: any) {
            setErro(error.message || "Erro ao chamar garçom.");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Realizar Pedido
            </Typography>

            {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

            {!pedido && (
                <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Criar Novo Pedido
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Nome do Cliente"
                                value={nomeCliente}
                                onChange={(e) => setNomeCliente(e.target.value)}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Número da Mesa"
                                type="number"
                                value={numeroMesa}
                                onChange={(e) => setNumeroMesa(e.target.value)}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={criarPedido}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Criar Pedido
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {pedido && (
                <>
                    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Itens Disponíveis
                        </Typography>
                        {carregando ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="150px">
                                <CircularProgress />
                                <Typography variant="h5">Carregando itens...</Typography>
                            </Box>
                        ) : itens.length === 0 ? (
                            <Typography variant="body1" color="textSecondary" align="center">
                                Nenhum item disponível no momento.
                            </Typography>
                        ) : (
                            <Grid container spacing={3}>
                                {itens.map((item) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                                        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" component="div">
                                                    {item.nome}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    R${item.preco.toFixed(2)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {item.descricao || "Sem descrição."}
                                                </Typography>
                                            </CardContent>
                                            <CardActions sx={{ mt: 'auto', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <TextField
                                                    label="Qtd."
                                                    type="number"
                                                    size="small"
                                                    value={quantidades[item.id] || 1}
                                                    onChange={(e) =>
                                                        setQuantidades({
                                                            ...quantidades,
                                                            [item.id]: Math.max(1, Number(e.target.value)),
                                                        })
                                                    }
                                                    sx={{ width: 80 }}
                                                    inputProps={{ min: "1" }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => adicionarDetalhe(item.id)}
                                                >
                                                    Adicionar
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>

                    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Resumo do Pedido
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Cliente: {pedido.nomeCliente}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Mesa: {pedido.numeroMesaCliente}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                            Total: R${total.toFixed(2)}
                        </Typography>
                        <Divider />
                        <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
                            Itens do Pedido:
                        </Typography>
                        {detalhesPedido.length === 0 ? (
                            <Typography variant="body2" color="textSecondary">
                                Nenhum item adicionado ao pedido ainda.
                            </Typography>
                        ) : (
                            <List>
                                {detalhesPedido.map((detalhe) => (
                                    <ListItem key={detalhe.id} disablePadding>
                                        <ListItemText
                                            primary={`${detalhe.item.nome} - Qtd: ${detalhe.quantidade}`}
                                            secondary={`Preço: R$${(detalhe.item.preco * detalhe.quantidade).toFixed(2)}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={chamarGarcom}
                            size="large"
                        >
                            Chamar Garçom
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
}

export default CriarPedido;