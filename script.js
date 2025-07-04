import * as fileHandler from './modules/fileHandler.js';
import * as api from './modules/api.js';
import * as ui from './modules/ui.js';
import * as exportUtils from './modules/export.js';
import * as history from './modules/history.js';

const showdownConverter = new showdown.Converter();

const markdownOutput = document.getElementById('markdown-output');
const htmlPreview = document.getElementById('html-preview');
const convertButton = document.getElementById('convert-button');
const exportMd = document.getElementById('export-md');
const exportPdf = document.getElementById('export-pdf');
const copyHtml = document.getElementById('copy-html');
const copyButton = document.getElementById('copy-button');
const historyList = document.getElementById('history-list');

function updatePreview() {
    ui.updatePreview(markdownOutput.value, htmlPreview, showdownConverter);
}

function loadSelectedItem(selectedItem) {
    markdownOutput.value = selectedItem.markdown;
    updatePreview();
    ui.showImagePreview(selectedItem.image);
    ui.showExportOptions();
    ui.showCopyButton();
}

document.addEventListener('DOMContentLoaded', () => {
    const initialHistory = history.loadHistory();
    ui.updateHistoryDropdown(initialHistory);
    fileHandler.setupEventListeners();

    markdownOutput.addEventListener('input', updatePreview);

    convertButton.addEventListener('click', async () => {
        const { fileMimeType, base64ImageData } = fileHandler.getFileData();
        if (!base64ImageData) {
            ui.showError('No se ha seleccionado ninguna imagen.');
            return;
        }
        ui.setLoading(true);
        ui.hideError();
        markdownOutput.value = '';
        ui.hideCopyButton();

        try {
            const result = await api.convertImageToMarkdown(base64ImageData, fileMimeType);
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                markdownOutput.value = text;
                updatePreview();
                ui.showCopyButton();
                ui.showExportOptions();
                const newHistory = history.addToHistory(text, `data:${fileMimeType};base64,${base64ImageData}`);
                ui.updateHistoryDropdown(newHistory);
            } else {
                throw new Error("La respuesta de la API no contiene texto.");
            }
        } catch (error) {
            ui.showError(`Error: ${error.message}`);
        } finally {
            ui.setLoading(false);
        }
    });

    exportMd.addEventListener('click', () => exportUtils.exportMarkdown(markdownOutput.value));
    exportPdf.addEventListener('click', () => exportUtils.exportPDF(htmlPreview));

    copyHtml.addEventListener('click', () => {
        exportUtils.copyToClipboard(htmlPreview.innerHTML)
            .then(() => ui.showToast('HTML copiado al portapapeles.'))
            .catch(() => ui.showError('No se pudo copiar el HTML.'));
    });

    copyButton.addEventListener('click', () => {
        exportUtils.copyToClipboard(markdownOutput.value)
            .then(() => {
                ui.showToast('Markdown copiado.');
                ui.toggleCopyIcon(true);
                setTimeout(() => ui.toggleCopyIcon(false), 2000);
            })
            .catch(() => ui.showError('No se pudo copiar el Markdown.'));
    });

    historyList.addEventListener('click', (e) => {
        const itemElement = e.target.closest('.history-item');
        if (itemElement) {
            const selectedId = itemElement.dataset.id;
            const selectedItem = history.getHistoryItem(selectedId);
            if (selectedItem) {
                loadSelectedItem(selectedItem);
            }
        }
    });
});