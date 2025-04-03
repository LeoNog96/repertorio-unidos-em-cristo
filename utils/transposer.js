const notas = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function transpChord(chord, capo) {
    if (!capo || capo === 0) return chord;

    const regex = /^([A-G])([#b]?)(.*)$/;
    const match = chord.match(regex);
    if (!match) return chord;

    let [, base, accidental, rest] = match;
    let index = notas.indexOf(base + accidental);
    if (index === -1) return chord;

    index = (index + capo) % 12;
    return notas[index] + rest;
}

function transposeText(text, capo) {
    return text.replace(/\b([A-G][#b]?)([m7susdimaug°]*)\b/g, (_, c, rest) => {
        return transpChord(c, capo) + rest;
    });
}

module.exports = { transpChord, transposeText };
