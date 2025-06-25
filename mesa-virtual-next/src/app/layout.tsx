import Link from "next/link";
import "./globals.css";
import { AppBar, Box, Button, Container, CssBaseline, Toolbar, Typography } from "@mui/material";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {/* Barra de ferramentadas */}
        <AppBar position="static">
          <Toolbar>
            {/* Left side */}
            <Link href="/" passHref>
              <Button color="inherit">Home</Button>
            </Link>

            {/* Spacer pushes following items to the right */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Right side */}
            <Link href="/funcionario/login" passHref>
              <Button color="inherit">Login</Button>
            </Link>
            <Link href="/funcionario/cadastrar" passHref>
              <Button color="inherit">Cadastrar</Button>
            </Link>
          </Toolbar>
        </AppBar>

        {/* Conteúdo - Componentes criados por nós */}
        <Box component="main"
          sx={{ minHeight: "calc(100vh - 120px)", py: 4 }}>
          <Container>
            {children}
          </Container>
        </Box>
      </body>
    </html>
  );
}