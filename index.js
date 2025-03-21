// index.js
const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;

// Servir arquivos estáticos (HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/exportar-pdf', async (req, res) => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const filePath = `file://${path.join(__dirname, 'public', 'repertorio-completo.html')}`;
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.musica');

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true
    });

    await browser.close();

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="repertorio-completo.pdf"'
    });
    res.send(pdfBuffer);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
