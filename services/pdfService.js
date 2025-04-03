import puppeteer from 'puppeteer';

/**
 * Gera um PDF a partir de um conteúdo HTML
 * @param {string} html - conteúdo HTML completo
 * @param {string} outputPath - caminho onde o PDF será salvo
 */
export async function gerarPDF(html, outputPath) {
    const browser = await puppeteer.launch({
        headless: 'new', // recomendado para puppeteer >= v19
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            bottom: '20mm',
            left: '15mm',
            right: '15mm'
        }
    });

    await browser.close();
}
