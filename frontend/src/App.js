import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, AppBar, Toolbar, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Grid, TextField, Card, CardContent,
  IconButton, MenuItem, Select, FormControl, InputLabel, LinearProgress,
  Snackbar, Alert, Chip, createTheme, ThemeProvider, CssBaseline,
  Divider, Stack
} from '@mui/material';
import { 
  Add as AddIcon, Delete as DeleteIcon, Brightness4, Brightness7, 
  Category as CategoryIcon, AccountBalance as BudgetIcon, RocketLaunch
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// URL-ul de bază pentru backend-ul tău
const API_URL = 'http://localhost:8080/api/subscriptions';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: darkMode ? '#90caf9' : '#4361ee' },
      background: {
        default: darkMode ? '#0a0a0b' : '#f8f9fc',
        paper: darkMode ? '#161618' : '#ffffff',
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h6: { fontWeight: 700 },
      h4: { fontWeight: 800 },
    },
    shape: { borderRadius: 16 },
  }), [darkMode]);

  // STATE-URI PENTRU DATE
  const [subscriptii, setSubscriptii] = useState([]);
  const [categorii, setCategorii] = useState(['Entertainment', 'Music', 'Shopping', 'Cloud/Tech']);
  const [categorieNouaInput, setCategorieNouaInput] = useState('');
  const [buget, setBuget] = useState(250);
  const [numeNou, setNumeNou] = useState('');
  const [pretNou, setPretNou] = useState('');
  const [categorieSelectata, setCategorieSelectata] = useState('Entertainment');
  const [openAlert, setOpenAlert] = useState(false);

  // 1. FUNCȚIE: ÎNCĂRCARE DATE DIN BACKEND
  const incarcaDate = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    // Filtrăm orice date care nu au nume sau preț (pentru a nu mai vedea rânduri goale)
    const dateValide = data.filter(s => s.name && s.price);
    
    const culoriGradients = ['#4361ee', '#e74c3c', '#9b59b6','#f8ff6b', '#4cc9f0', '#f72585', '#b5179e'];
    const dateCuCulori = dateValide.map((s, index) => ({
      ...s,
      color: culoriGradients[index % culoriGradients.length]
    }));
    
    setSubscriptii(dateCuCulori);
  } catch (error) {
    console.error("Eroare la încărcare:", error);
  }
};

  // Apelăm încărcarea la prima deschidere a paginii
  useEffect(() => {
    incarcaDate();
  }, []);

  // 2. FUNCȚIE: ADĂUGARE CATEGORIE (Local)
  const adaugaCategorie = () => {
    if (categorieNouaInput && !categorii.includes(categorieNouaInput)) {
      setCategorii([...categorii, categorieNouaInput]);
      setCategorieNouaInput('');
    }
  };

  // 3. FUNCȚIE: ADĂUGARE SUBSCRIPȚIE (Trimitere la Backend)
  const adaugaSubscriptie = async () => {
  if (numeNou && pretNou) {
    const nouaSub = {
      name: numeNou,       // AM SCHIMBAT nume -> name
      price: parseFloat(pretNou), // AM SCHIMBAT pret -> price
      category: categorieSelectata, // AM SCHIMBAT categorie -> category (dacă ai în Java)
      currency: "RON"      // Adăugat pentru a se potrivi cu entitatea Java
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouaSub)
      });

      if (response.ok) {
        setNumeNou(''); 
        setPretNou('');
        setOpenAlert(true);
        incarcaDate(); 
      }
    } catch (error) {
      console.error("Eroare la salvarea subscripției:", error);
    }
  }
};

  // 4. FUNCȚIE: ȘTERGERE SUBSCRIPȚIE
  const stergeSubscriptie = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setOpenAlert(true);
        incarcaDate();
      } else {
        alert("Eroare la ștergere. Serverul a răspuns cu o problemă.");
      }
    } catch (error) {
      console.error("Eroare la ștergere:", error);
    }
  };

  const totalLunar = subscriptii.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const procentBuget = Math.min((totalLunar / buget) * 100, 100);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');`}</style>
      
      <Box sx={{ minHeight: '100vh', pb: 8 }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <RocketLaunch sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>SubMng.io</Typography>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="primary">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Grid container spacing={4}>
            
            {/* PANOU CONTROL (STÂNGA) */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                
                <Card sx={{ 
                  borderRadius: 5, 
                  background: totalLunar > buget ? 'linear-gradient(135deg, #ef233c 0%, #d90429 100%)' : 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                  color: 'white', p: 1
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>BUGET TOTAL</Typography>
                    <Typography variant="h4" sx={{ my: 1 }}>{totalLunar} / {buget} RON</Typography>
                    <LinearProgress variant="determinate" value={procentBuget} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' }}} />
                  </CardContent>
                </Card>

                <Paper sx={{ p: 3, borderRadius: 5 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    <BudgetIcon fontSize="small" sx={{ mr: 1 }} /> Setări Buget
                  </Typography>
                  <TextField fullWidth size="small" type="number" value={buget} onChange={e => setBuget(parseFloat(e.target.value) || 0)} sx={{ mb: 3 }} />
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon fontSize="small" sx={{ mr: 1 }} /> Gestionare Categorii
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField size="small" fullWidth placeholder="Categorie nouă..." value={categorieNouaInput} onChange={e => setCategorieNouaInput(e.target.value)} />
                    <Button variant="contained" onClick={adaugaCategorie}><AddIcon /></Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {categorii.map(c => <Chip key={c} label={c} size="small" variant="outlined" />)}
                  </Box>
                </Paper>

                <Paper sx={{ p: 3, borderRadius: 5 }}>
                  <Typography variant="h6" gutterBottom>Adaugă Serviciu</Typography>
                  <Stack spacing={2}>
                    <TextField fullWidth label="Nume" size="small" value={numeNou} onChange={e => setNumeNou(e.target.value)} />
                    <TextField fullWidth label="Cost" type="number" size="small" value={pretNou} onChange={e => setPretNou(e.target.value)} />
                    <FormControl fullWidth size="small">
                      <InputLabel>Categorie</InputLabel>
                      <Select value={categorieSelectata} label="Categorie" onChange={e => setCategorieSelectata(e.target.value)}>
                        {categorii.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <Button fullWidth variant="contained" onClick={adaugaSubscriptie} sx={{ py: 1.5 }}>Salvează</Button>
                  </Stack>
                </Paper>

              </Stack>
            </Grid>

            {/* VIZUALIZARE (DREAPTA) */}
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper} sx={{ borderRadius: 5, mb: 4 }}>
                <Table>
                  <TableHead sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>SERVICIU</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>CATEGORIE</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>COST</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptii.map((row) => (
                      <TableRow key={row.id} hover>
<TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
  <TableCell>
    <Chip label={row.category} size="small" sx={{ fontWeight: 700, bgcolor: `${row.color}20`, color: row.color }} />
  </TableCell>
  <TableCell align="right" sx={{ fontWeight: 700 }}>{row.price} RON</TableCell>
  <TableCell align="center">
    <IconButton size="small" color="error" onClick={() => stergeSubscriptie(row.id)}>
      <DeleteIcon fontSize="small" />
    </IconButton>
  </TableCell>
</TableRow>
                    ))}
                    {subscriptii.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3, opacity: 0.5 }}>Nicio subscripție găsită. Adaugă una!</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Paper sx={{ p: 4, borderRadius: 5, height: 400 }}>
                <Typography variant="h6" sx={{ mb: 4 }}>Analiză vizuală</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={subscriptii} dataKey="price" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5}>
                      {subscriptii.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

          </Grid>
        </Container>

        <Snackbar open={openAlert} autoHideDuration={2000} onClose={() => setOpenAlert(false)}>
          <Alert severity="success" variant="filled">Actualizat cu succes în baza de date!</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}