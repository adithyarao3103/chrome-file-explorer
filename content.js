function enhanceFileExplorer() {
    // Remove default header
    const defaultHeader = document.querySelector('body > h1');
    if (defaultHeader) {
    defaultHeader.remove();
    }

    const parentDirLink = document.getElementById('parentDirLink');
    if (parentDirLink) {
        parentDirLink.classList.remove('up');
        parentDirLink.classList.add('parent');
        parentDirLink.innerText = 'Parent Directory';
}

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
    const size = parseInt(cell.data-value);
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
    return 'Today ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else {
    return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }) + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}

enhanceFileExplorer();