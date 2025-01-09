function enhanceFileExplorer() {
    // Remove default header
    const defaultHeader = document.querySelector('body > h1');
    if (defaultHeader) {
    defaultHeader.remove();
    }

    document.getElementById('parentDirLink').classList.remove('up');

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
    
    // Move the table into the container
    const table = document.querySelector('table');
    if (table) {
    container.appendChild(header);
    container.appendChild(table);
    document.body.appendChild(container);
    }

    // Decode URL-encoded names in links
    document.querySelectorAll('td a').forEach(link => {
    const text = link.textContent;
    if (text && text !== '[Parent Directory]') {
        link.textContent = decodeURIComponent(text);
    }
    });

    // Remove all default icons and images
    // const icons = document.querySelectorAll('td img, td a img, img[src$="blank.gif"], img[src$="directory.gif"], img[src$="generic.gif", div img, div a img]');
    // icons.forEach(icon => icon.remove());
    
    // Also remove any background images set inline
    document.querySelectorAll('td a').forEach(link => {
    link.style.backgroundImage = 'none';
    });

    // Add file size formatting
    const sizeColumns = document.querySelectorAll('td:nth-child(2)');
    sizeColumns.forEach(cell => {
    const size = parseInt(cell.textContent);
    if (!isNaN(size)) {
        cell.textContent = formatFileSize(size);
    }
    });

    // Add date formatting
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

// Run the enhancement when the page loads
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', enhanceFileExplorer);
// } else {
//     enhanceFileExplorer();
// }

enhanceFileExplorer();