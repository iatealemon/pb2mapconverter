// State management
const state = {
    currentPage: 'upload',
    selectedFile: null,
    processedContent: '',
};

// DOM elements
const uploadPage = document.getElementById('uploadPage');
const resultsPage = document.getElementById('resultsPage');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const clearBtn = document.getElementById('clearBtn');
const submitBtn = document.getElementById('submitBtn');
const status = document.getElementById('status');
const progressWrap = document.getElementById('progressWrap');
const progressBar = document.getElementById('progressBar');
const backBtn = document.getElementById('backBtn');
const contentTextarea = document.getElementById('contentTextarea');
const copyBtn = document.getElementById('copyBtn');
const copySuccess = document.getElementById('copySuccess');

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function setFile(file) {
    state.selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
    fileInfo.classList.add('visible');
    submitBtn.disabled = false;
    setStatus('', '');
}

function clearFile() {
    state.selectedFile = null;
    fileInput.value = '';
    fileInfo.classList.remove('visible');
    submitBtn.disabled = true;
    progressWrap.classList.remove('visible');
    progressBar.style.width = '0%';
    setStatus('', '');
}

function setStatus(msg, type) {
    status.textContent = msg;
    status.className = 'status' + (type ? ' ' + type : '');
}

function goToPage(pageName) {
    state.currentPage = pageName;
    uploadPage.classList.toggle('active', pageName === 'upload');
    resultsPage.classList.toggle('active', pageName === 'results');
}

fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) setFile(fileInput.files[0]);
});

clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearFile();
});

// Drag & drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

['dragleave', 'dragend'].forEach((evt) => dropZone.addEventListener(evt, () => dropZone.classList.remove('drag-over')));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) setFile(file);
});

// Upload
submitBtn.addEventListener('click', () => {
    if (!state.selectedFile) return;

    const formData = new FormData();
    formData.append('file', state.selectedFile);

    submitBtn.disabled = true;
    progressWrap.classList.add('visible');
    progressBar.style.width = '0%';
    setStatus('Uploading…', '');

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            progressBar.style.width = Math.round((e.loaded / e.total) * 100) + '%';
        }
    });

    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            progressBar.style.width = '100%';

            try {
                const response = JSON.parse(xhr.responseText);
                state.processedContent = response.data || xhr.responseText;
                contentTextarea.value = state.processedContent;
                goToPage('results');
            } catch {
                state.processedContent = xhr.responseText;
                contentTextarea.value = xhr.responseText;
                goToPage('results');
            }
        } else {
            try {
                const response = JSON.parse(xhr.responseText);
                setStatus('Upload failed - possibly invalid XML file?\n' + response['details'], 'error');
            } catch {
                setStatus('Upload failed - server returned ' + xhr.status, 'error');
            }
            submitBtn.disabled = false;
        }
    });

    xhr.addEventListener('error', () => {
        setStatus('Network error. Try again.', 'error');
        submitBtn.disabled = false;
    });

    xhr.open('POST', '/upload');
    xhr.send(formData);
});

// Navigation
backBtn.addEventListener('click', () => {
    clearFile();
    goToPage('upload');
});

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(contentTextarea.value);
        copySuccess.style.display = 'block';
        setTimeout(() => {
            copySuccess.style.display = 'none';
        }, 2000);
    } catch (err) {
        alert('Failed to copy to clipboard');
    }
});
