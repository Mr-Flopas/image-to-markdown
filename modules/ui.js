const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loader');
const buttonText = document.getElementById('button-text');
const copyButton = document.getElementById('copy-button');
const copyIconDefault = document.getElementById('copy-icon-default');
const copyIconSuccess = document.getElementById('copy-icon-success');
const historyList = document.getElementById('history-list');
const historyPlaceholder = document.getElementById('history-placeholder');
const imagePreview = document.getElementById('image-preview');
const imagePreviewContainer = document.getElementById('image-preview-container');
const uploadPrompt = document.getElementById('upload-prompt');
const exportOptions = document.getElementById('export-options');

export function setLoading(isLoading) {
    const convertButton = document.getElementById('convert-button');
    convertButton.disabled = isLoading;
    loader.classList.toggle('hidden', !isLoading);
    buttonText.textContent = isLoading ? 'Digitalizando...' : 'Digitalizar';
}

export function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

export function hideError() {
    errorMessage.classList.add('hidden');
}

export function showCopyButton() { copyButton.classList.remove('hidden'); }
export function hideCopyButton() { copyButton.classList.add('hidden'); }
export function showExportOptions() { exportOptions.classList.remove('hidden'); exportOptions.classList.add('flex', 'fade-in'); }
export function showImagePreview(imageSrc) {
    imagePreview.src = imageSrc;
    imagePreviewContainer.classList.remove('hidden');
    uploadPrompt.classList.add('hidden');
}

export function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg fade-in';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

export function toggleCopyIcon(success) {
    copyIconDefault.classList.toggle('hidden', success);
    copyIconSuccess.classList.toggle('hidden', !success);
}

export function updateHistoryDropdown(historyItems) {
    if (historyItems.length === 0) {
        historyPlaceholder.classList.remove('hidden');
        historyList.innerHTML = '';
    } else {
        historyPlaceholder.classList.add('hidden');
        historyList.innerHTML = historyItems.map(item => `
            <div class="history-item py-2 px-3 rounded-lg hover:bg-gray-700/50 cursor-pointer" data-id="${item.id}">
                <p class="text-sm font-medium text-gray-200">${item.date}</p>
                <p class="text-xs text-gray-400 truncate">${item.markdown.substring(0, 40)}...</p>
            </div>
        `).join('');
    }
}

export function updatePreview(markdownText, htmlPreview, converter) {
    htmlPreview.innerHTML = converter.makeHtml(markdownText);
}