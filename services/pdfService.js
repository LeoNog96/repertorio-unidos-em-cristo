import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export async function gerarPDF() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const targetUrl = `http://localhost:3000/repertorio-completo.html`;

    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    await page.waitForSelector('.musica', { visible: true });

    const filePath = path.join(process.cwd(), 'repertorio-final.pdf');

    await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '40px', bottom: '40px', left: '30px', right: '30px' }
    });

    await browser.close();
    return filePath;
}
