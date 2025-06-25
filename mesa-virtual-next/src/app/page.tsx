'use client';

import React, { useEffect, useState } from "react";
import { API_URL } from "@/utils/apiUrl";
import Categoria from "@/types/categoria";
import Link from "next/link";
import {
  CssBaseline,
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";

const Home: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const resposta = await fetch(`${API_URL}/categorias`).then((res) =>
          res.json()
        );
        setCategorias(resposta);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          BEM-VINDO À MESA VIRTUAL
        </Typography>

        {/* Navigation Buttons */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <Link href="/funcionario/">
            <Button variant="outlined">
              Área do Garçom
            </Button>
          </Link>
          <Link href="/cliente/pedidos">
            <Button variant="outlined">
              Área do Cliente
            </Button>
          </Link>
          <Link href="/cliente/pedidos/criar">
            <Button variant="outlined">Fazer um Pedido</Button>
          </Link>
        </Stack>

        {/* Categorias e Itens */}
        {categorias.map((categoria) => (
          <Box key={categoria.id} sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom>
              {categoria.nome}
            </Typography>
            <Grid container spacing={3}>
              {categoria.itens.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={`http://localhost:5270/${item.imagemUrl}`}
                      alt={item.nome}
                    />
                    <CardContent>
                      <Typography variant="h6">{item.nome}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.descricao}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        Preço: R${item.preco.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </>
  );
};

export default Home;
