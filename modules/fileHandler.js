import * as ui from './ui.js';

const uploadArea = document.getElementById('upload-area');
const fileUpload = document.getElementById('file-upload');
const convertButton = document.getElementById('convert-button');

let base64ImageData = null;
let fileMimeType = null;

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        ui.showError('Por favor, selecciona un archivo de imagen válido.');
        return;
    }
    ui.hideError();
    fileMimeType = file.type;
    const reader = new FileReader();
    reader.onload = (e) => {
        ui.showImagePreview(e.target.result);
        convertButton.disabled = false;
        // CORRECCIÓN CRÍTICA: Guardar la imagen en base64
        base64ImageData = e.target.result.split(',')[1];
    };
    reader.readAsDataURL(file);
}

export function setupEventListeners() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, e => e.preventDefault());
        uploadArea.addEventListener(eventName, e => e.preventDefault());
    });
    ['dragenter', 'dragover'].forEach(eventName => uploadArea.addEventListener(eventName, () => uploadArea.classList.add('border-blue-500')));
    ['dragleave', 'drop'].forEach(eventName => uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('border-blue-500')));

    uploadArea.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));
    fileUpload.addEventListener('change', e => handleFile(e.target.files[0]));
}

export function getFileData() {
    return { fileMimeType, base64ImageData };
}