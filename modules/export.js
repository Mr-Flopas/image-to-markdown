const { jsPDF } = window.jspdf;

export function exportMarkdown(text) {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notas.md';
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function exportPDF(htmlElement) {
    const doc = new jsPDF();
    doc.html(htmlElement, {
        callback: (doc) => doc.save('documento.pdf'),
        x: 10,
        y: 10,
        width: 180,
        windowWidth: 800
    });
}

export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
}