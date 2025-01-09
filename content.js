function enhanceFileExplorer() {
    // Remove default header
    const defaultHeader = document.querySelector('body > h1');
    if (defaultHeader) {
        defaultHeader.remove();
    }

    document.getElementById('parentDirLink').classList.remove('up');
    document.getElementById('parentDirLink').classList.add('parent');
    document.getElementById('parentDirText').innerText = 'Parent Directory';

    // Create container
    const container = document.createElement('div');
    container.className = 'explorer-container';

    // Add custom header
    const header = document.createElement('header');
    const path = document.location.pathname;
    const folderName = decodeURIComponent(path.split('/').filter(Boolean).pop() || 'Root');

    header.innerHTML = `
    <h1 class="explorer-header">
        ${folderName}
    </h1>
    `;

    const table = document.querySelector('table');
    if (table) {
        container.appendChild(header);
        container.appendChild(table);
        document.body.appendChild(container);
    }

    document.querySelectorAll('td a').forEach(link => {
        const text = link.textContent;
        if (text && text !== '[Parent Directory]') {
            link.textContent = decodeURIComponent(text);
        }
    });

    document.querySelectorAll('td a').forEach(link => {
        link.style.backgroundImage = 'none';
    });

    const sizeColumns = document.querySelectorAll('td:nth-child(2)');
    sizeColumns.forEach(cell => {
        const size = parseInt(cell.dataset.value);
        if (!isNaN(size)) {
            cell.textContent = formatFileSize(size);
        }
    });

    const dateColumns = document.querySelectorAll('td:nth-child(3)');
    dateColumns.forEach(cell => {
        const date = new Date(cell.textContent);
        if (!isNaN(date)) {
            cell.textContent = formatDate(date);
        }
    });

    // Add file previews
    addFilePreviews();
}

function addFilePreviews() {
    const links = document.querySelectorAll('td a');
    links.forEach(link => {
        const fileType = getFileType(link.href);
        if (fileType === 'image') {
            link.addEventListener('mouseover', () => showPreview(link, 'image'));
            link.addEventListener('mouseout', hidePreview);
        } else if (fileType === 'video') {
            link.addEventListener('mouseover', () => showPreview(link, 'video'));
            link.addEventListener('mouseout', hidePreview);
        }
    });
}

function getFileType(url) {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
        return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
        return 'video';
    } else if (['txt', 'log', 'json', 'csv', 'html', 'js'].includes(extension)) {
        return 'text';
    }
    return null;
}

function showPreview(link, type) {
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    preview.style.visibility = 'hidden'; // Hide until fully positioned

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = link.href;
        img.alt = 'Image Preview';
        preview.appendChild(img);
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.src = link.href;
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.style.display = 'block'; // Ensure it takes up space correctly
        preview.appendChild(video);
    }

    document.body.appendChild(preview);

    // Wait for the preview to be fully rendered before positioning
    requestAnimationFrame(() => positionPreview(preview, link));
}

function positionPreview(preview, link) {
    const rect = link.getBoundingClientRect();
    const previewRect = preview.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top, left;

    if (rect.bottom + previewRect.height + 10 <= viewportHeight) {
        top = rect.bottom + window.scrollY + 10;
    } else {
        top = rect.top + window.scrollY - previewRect.height - 10;
    }

    if (rect.left + previewRect.width <= viewportWidth) {
        left = rect.left + window.scrollX;
    } else {
        left = viewportWidth + window.scrollX - previewRect.width - 10;
    }

    preview.style.position = 'absolute';
    preview.style.top = `${top}px`;
    preview.style.left = `${left}px`;

    preview.style.visibility = 'visible'; // Make visible after positioning
}

function hidePreview() {
    const preview = document.querySelector('.file-preview');
    if (preview) {
        preview.remove();
    }
}


function formatFileSize(bytes) {
    if (typeof bytes !== 'number') return 'Invalid input';
    if (bytes < 0) return 'Invalid size';
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

    // Limit i to the last index of sizes array
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(date) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
        return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

enhanceFileExplorer();
