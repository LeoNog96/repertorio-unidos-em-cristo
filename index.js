
const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;

// Servir arquivos estáticos (HTML)
app.use(express.static(path.join(__dirname, 'public')));

const fs = require('fs');

app.get('/exportar-pdf', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const targetUrl = `http://localhost:${PORT}/repertorio-completo.html`;

  await page.goto(targetUrl, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.waitForSelector('.musica', { visible: true });

  await page.setViewport({ width: 1280, height: 1800 });

  const filePath = path.join(__dirname, 'repertorio-final.pdf');

  await page.pdf({
    path: filePath, // Salva em disco
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '40px', bottom: '40px', left: '30px', right: '30px' }
  });

  await browser.close();

  res.download(filePath, 'repertorio.pdf', (err) => {
    if (err) {
      console.error('Erro ao enviar PDF:', err);
    } else {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Erro ao apagar o PDF:', err);
        else console.log('PDF apagado com sucesso!');
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
