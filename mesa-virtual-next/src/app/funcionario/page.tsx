'use client';
import React, { useEffect, useState } from "react";
import { API_URL } from "@/utils/apiUrl";
import Pedido from "@/types/pedido";
import DetalhePedido from "@/types/detalhePedido";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

import {
    Box,
    Button,
    Container,
    Typography,
    Grid,
    Paper,
    TextField,
    Divider,
    Stack,
} from "@mui/material";

const FuncionarioHome: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [numeroMesa, setNumeroMesa] = useState<number>(0);
    const [pedidoMesa, setPedidoMesa] = useState<Pedido | null>(null);
    useAuth();

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch(`${API_URL}/pedidos`);
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error("Erro ao carregar os pedidos:", error);
            }
        };
        fetchPedidos();
    }, []);

    const fetchPedidosPorMesa = async () => {
        if (numeroMesa) {
            try {
                const response = await fetch(`${API_URL}/pedidos/mesa/${numeroMesa}`);
                const data = await response.json();
                setPedidoMesa(data[0] || null);
            } catch (error) {
                console.error("Erro ao carregar os pedidos da mesa:", error);
            }
        }
    };

    const renderDetalhesPedido = (detalhes: DetalhePedido[]) => (
        <Stack spacing={1}>
            {detalhes.map((detalhe) => (
                <Paper key={detalhe.id} variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {detalhe.item?.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {detalhe.item?.descricao}
                    </Typography>
                    <Typography variant="body2">Preço: R${detalhe.item?.preco.toFixed(2)}</Typography>
                    <Typography variant="body2">Quantidade: {detalhe.quantidade}</Typography>
                </Paper>
            ))}
        </Stack>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Pedidos
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
                <Link href="/funcionario/categorias" passHref>
                    <Button variant="outlined">Gerenciar Categorias</Button>
                </Link>
                <Link href="/funcionario/itens" passHref>
                    <Button variant="outlined">Gerenciar Pratos</Button>
                </Link>
            </Stack>

            <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", mb: 4 }} elevation={3}>
                <Typography variant="subtitle1" gutterBottom>
                    Buscar Pedido por Número da Mesa
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Número da Mesa"
                        type="number"
                        fullWidth
                        value={numeroMesa}
                        onChange={(e) => setNumeroMesa(Number(e.target.value))}
                    />
                    <Button variant="contained" onClick={fetchPedidosPorMesa}>
                        Buscar Pedidos
                    </Button>
                </Stack>
            </Paper>

            {pedidoMesa && (
                <Paper sx={{ p: 3, border: '1px solid', borderColor: 'primary.main', mb: 4 }} elevation={2}>
                    <Typography variant="h6">
                        Pedido da Mesa {pedidoMesa.numeroMesaCliente}
                    </Typography>
                    <Typography>Cliente: {pedidoMesa.nomeCliente}</Typography>
                    <Typography>
                        Data do Pedido: {new Date(pedidoMesa.dataPedido).toLocaleString()}
                    </Typography>
                    <Typography>
                        Chamado Garçom: {pedidoMesa.chamadoGarcom ? "Sim" : "Não"}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Detalhes do Pedido:
                    </Typography>
                    {renderDetalhesPedido(pedidoMesa.detalhesPedido)}
                </Paper>
            )}

            <Box>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Todos os Pedidos
                </Typography>
                {pedidos.length > 0 ? (
                    <Grid container spacing={3}>
                        {pedidos.map((pedido) => (
                            <Grid size={{xs: 12, md: 6}} key={pedido.id}>
                                <Paper sx={{ p: 3 }} elevation={2}>
                                    <Typography variant="h6">
                                        Pedido de {pedido.nomeCliente}
                                    </Typography>
                                    <Typography>Mesa: {pedido.numeroMesaCliente}</Typography>
                                    <Typography>
                                        Data do Pedido:{" "}
                                        {new Date(pedido.dataPedido).toLocaleString()}
                                    </Typography>
                                    <Typography>
                                        Chamado Garçom: {pedido.chamadoGarcom ? "Sim" : "Não"}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Detalhes:
                                    </Typography>
                                    {renderDetalhesPedido(pedido.detalhesPedido)}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography align="center" color="text.secondary">
                        Não há pedidos para exibir.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default FuncionarioHome;
