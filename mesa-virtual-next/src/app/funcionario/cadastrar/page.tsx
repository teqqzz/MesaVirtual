'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/axiosAuth';
import {
    Box,
    Button,
    Container,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

export default function CadastrarFuncionario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [permissao, setPermissao] = useState(0);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post('/usuario/cadastrar', {
                nome,
                email,
                senha,
                role: permissao,
            });

            alert('Usuário cadastrado com sucesso!');
            router.push('/funcionario/login');
        } catch (error: any) {
            console.error(error);
            alert('Erro ao cadastrar usuário. Tente novamente.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Cadastro
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Nome"
                                variant="outlined"
                                fullWidth
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextField
                                label="Senha"
                                variant="outlined"
                                type="password"
                                fullWidth
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                            <TextField
                                label="Permissão"
                                select
                                fullWidth
                                value={permissao}
                                onChange={(e) => setPermissao(Number(e.target.value))}
                            >
                                <MenuItem value={0}>Funcionário</MenuItem>
                                <MenuItem value={1}>Gerente</MenuItem>
                            </TextField>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                color="primary"
                            >
                                Cadastrar
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}
