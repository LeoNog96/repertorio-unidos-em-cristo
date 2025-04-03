export function gerarHTML(repertorio, musicas) {
    // Agrupar por categoria
    const categorias = {};

    musicas.forEach(m => {
        const cat = m.categoria || 'Sem Categoria';
        if (!categorias[cat]) categorias[cat] = [];
        categorias[cat].push(m);
    });

    // Começa o HTML
    let html = `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="utf-8" />
    <title>Repertórios</title>
    <style>
        body { font-family: sans-serif; margin: 2rem; line-height: 1.6; }
        h1, h2, h3 { margin-top: 2rem; }
        .sumario a { display: block; margin: 0.25rem 0; }
        .musica { margin-top: 1.5rem; border-top: 1px solid #ccc; padding-top: 1rem; page-break-inside: avoid; break-inside: avoid; }
        .letra-container { -webkit-column-count: 2; -moz-column-count: 2; column-count: 2; -webkit-column-gap: 2rem; -moz-column-gap: 2rem; column-gap: 2rem; }
        .letra { white-space: pre-wrap; font-family: monospace; font-size: 1rem; }
        .voltar { margin-top: 1.5rem; display: inline-block; font-size: 1.2rem; padding: 0.5rem 1rem; text-decoration: none; color: white; background-color: #007BFF; border-radius: 6px; }
        .voltar:hover { background-color: #0056b3; }
        .cabecalho-repertorio { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .titulo-repertorio { font-size: 2.5rem; font-weight: bold; text-align: left; flex: 1; margin: 0; color: #222; }
        .logo-repertorio { max-width: 140px; height: auto; }
        .exportar { margin: 1rem 0; display: inline-block; padding: 0.75rem 1.5rem; background: #007BFF; color: #fff; text-decoration: none; font-size: 1.1rem; border-radius: 6px; }
        .exportar:hover { background: #0056b3; }
        @media screen and (max-width: 768px) { body { margin: 1rem; } .letra-container { column-count: 1; } h1 { font-size: 1.5rem; } h2 { font-size: 1.2rem; } h3 { font-size: 1.1rem; } .cabecalho-repertorio { flex-direction: column; align-items: center; text-align: center; } .titulo-repertorio { font-size: 1.6rem; text-align: center; } }
        @media print { .exportar { display: none !important; } .letra-container { column-count: 2 !important; column-gap: 2rem !important; } img { max-width: 140px !important; } .titulo-repertorio { font-size: 2rem; margin-top: 2rem; text-align: center; color: #000 !important; } }
    </style>
</head>

<body>
    <div class="cabecalho-repertorio">
        <h1 class="titulo-repertorio">${repertorio.nome}</h1>
        <img src="${repertorio.logoUrl}" alt="Logo Unidos em Cristo" class="logo-repertorio" />
    </div>

    <a class="exportar" href="/exportar-pdf/${repertorio.id}" target="_blank">📄 Exportar PDF</a>

    <div class="sumario" id="sumario">
        <h2>Sumário</h2>
`;

    // Sumário
    Object.keys(categorias).sort().forEach(cat => {
        html += `<strong>${cat}</strong><ul>`;
        categorias[cat].sort((a, b) => a.titulo.localeCompare(b.titulo)).forEach(m => {
            html += `<li><a href="#${m.titulo.toLowerCase().replace(/\s+/g, "-")}">${m.titulo}</a></li>`;
        });
        html += `</ul>`;
    });

    html += `</div>`;
    const forma = (m) => {
        const notas = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Mapeamento de bemóis para os seus correspondentes sustenidos
        const bemolParaSustenido = {
            'Db': 'C#',
            'Eb': 'D#',
            'Gb': 'F#',
            'Ab': 'G#',
            'Bb': 'A#'
        };

        let tom = m.tom;
        // Se a nota for bemol, converta para sustenido
        if (tom.includes('b')) {
            tom = bemolParaSustenido[tom] || tom;  // Substitui se for bemol
        }
    
        // Acha a posição da nota no array de notas
        const index = notas.indexOf(tom);
    
        if (index === -1) {
            return 'Nota não encontrada';  // Caso não encontre a nota
        }

        // Retorna a nota transposta considerando o capotraste
        return notas[(index - m.capotraste + 12) % 12];  // Ajusta a transposição com o capotraste

    }
    // Conteúdo das músicas
    Object.keys(categorias).sort().forEach(cat => {
        categorias[cat].sort((a, b) => a.titulo.localeCompare(b.titulo)).forEach(m => {
            html += `
            <div class="musica" id="${m.titulo.toLowerCase().replace(/\s+/g, "-")}">
                <h3>${m.titulo}</h3>
                <p><strong>Capotraste:</strong> ${m.capotraste == 0 ? 'Não utiliza' : m.capotraste + 'ª Casa'}</p>
                <p><strong>Tom:</strong> ${m.tom} (Acordes na forma de ${forma(m)})</p>
                <div class="letra-container">
                    <pre class="letra" data-letra>${m.letra}</pre>
                </div>
                <a class="voltar" href="#sumario">⬅️ Voltar ao Sumário</a>
            </div>
            `;
        });
    });

    html += `
</body>

<script>
const notas = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transpor(button, semitons) {
    const container = button.closest('.musica');
    const pre = container.querySelector('[data-letra]');
    const original = pre.innerText;

    pre.innerText = original.replace(/([A-G][#b]?)([^\w]?)/g, (match, acorde, resto) => {
        let i = notas.indexOf(acorde);
        if (i === -1) return match;
        i = (i + semitons + 12) % 12;
        return notas[i] + resto;
    });
}
</script>
</html>
`;

    return html;
}
