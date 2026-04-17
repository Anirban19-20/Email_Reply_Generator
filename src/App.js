import { useState } from 'react';
import './App.css';
import axios from 'axios';

import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress
} from '@mui/material';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!emailContent) return;

    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        { emailContent, tone }
      );

      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data, null, 2)
      );

    } catch (err) {
      console.error(err);
      setError('❌ Failed to generate email reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Email Reply Generator
      </Typography>

      <Box sx={{ mt: 3 }}>
        
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">💼 Professional</MenuItem>
            <MenuItem value="formal">📄 Formal</MenuItem>
            <MenuItem value="friendly">😊 Friendly</MenuItem>
            <MenuItem value="casual">😄 Casual</MenuItem>
            <MenuItem value="empathetic">❤️ Empathetic</MenuItem>
            <MenuItem value="apologetic">🙏 Apologetic</MenuItem>
            <MenuItem value="confident">💪 Confident</MenuItem>
            <MenuItem value="persuasive">🎯 Persuasive</MenuItem>
            <MenuItem value="urgent">⚡ Urgent</MenuItem>
            <MenuItem value="concise">✂️ Concise</MenuItem>
            <MenuItem value="detailed">📝 Detailed</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
          sx={{ py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Reply"}
        </Button>

        {loading && (
          <Typography align="center" sx={{ mt: 2 }}>
            ⏳ Generating reply, please wait...
          </Typography>
        )}

      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{ mt: 4 }}>
          
          <Typography variant="h6" gutterBottom>
            Generated Reply:
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={generatedReply}
            InputProps={{ readOnly: true }}
          />

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            fullWidth
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            Copy to Clipboard
          </Button>

        </Box>
      )}

    </Container>
  );
}

export default App;