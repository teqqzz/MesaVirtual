'use client'
import React, { useState } from "react";
import { API_URL } from "@/utils/apiUrl";
import Pedido from "@/types/pedido";
import DetalhePedido from "@/types/detalhePedido";

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Alert,
    Divider,
} from "@mui/material";

const HomePedido: React.FC = () => {
    const [numeroMesa, setNumeroMesa] = useState<number>(0);
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const fetchPedidoPorMesa = async () => {
        if (!numeroMesa) return;

        try {
            const response = await fetch(`${API_URL}/pedidos/mesa/${numeroMesa}`);

            if (response.status === 404) {
                setErrorMessage("Pedido não encontrado para esta mesa.");
                setPedido(null);
                return;
            }

            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                setErrorMessage("Não encontramos nenhum pedido para este número de mesa.");
                setPedido(null);
            } else {
                setPedido(data[0]);
                setErrorMessage("");
            }
        } catch (error) {
            console.error("Erro ao carregar o pedido da mesa:", error);
            setErrorMessage("Houve um erro ao buscar o pedido.");
            setPedido(null);
        }
    };

    const renderDetalhesPedido = (detalhes: DetalhePedido[]) => (
        <Box component="ul" sx={{ pl: 2 }}>
            {detalhes.map((detalhe) => (
                <Box component="li" key={detalhe.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {detalhe.item?.nome}
                    </Typography>
                    <Typography variant="body2">{detalhe.item?.descricao}</Typography>
                    <Typography variant="body2">
                        Preço: R${detalhe.item?.preco.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                        Quantidade: {detalhe.quantidade}
                    </Typography>
                </Box>
            ))}
        </Box>
    );

    return (
        <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", mt: 6, p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Visualizar um Pedido
            </Typography>

            <Box display="flex" gap={2} alignItems="center" mb={2}>
                <TextField
                    label="Número da Mesa"
                    type="number"
                    value={numeroMesa}
                    onChange={(e) => setNumeroMesa(Number(e.target.value))}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchPedidoPorMesa}
                    sx={{ minWidth: 150 }}
                >
                    Ver Pedido
                </Button>
            </Box>

            {errorMessage && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            {pedido && (
                <Box mt={4}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Pedido da Mesa {pedido.numeroMesaCliente}
                    </Typography>
                    <Typography>Cliente: {pedido.nomeCliente}</Typography>
                    <Typography>
                        Data do Pedido: {new Date(pedido.dataPedido).toLocaleString()}
                    </Typography>
                    <Typography>
                        Chamado Garçom: {pedido.chamadoGarcom ? "Sim" : "Não"}
                    </Typography>

                    <Box mt={3}>
                        <Typography variant="subtitle1" gutterBottom>
                            Detalhes do Pedido:
                        </Typography>
                        {renderDetalhesPedido(pedido.detalhesPedido)}
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default HomePedido;
