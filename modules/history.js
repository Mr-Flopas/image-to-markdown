const HISTORY_KEY = 'pixelpen_history';

export function loadHistory() {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
}

export function addToHistory(markdown, imageSrc) {
    let history = loadHistory();
    const historyItem = {
        id: new Date().toISOString(),
        markdown,
        image: imageSrc,
        date: new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    };
    history.unshift(historyItem);
    if (history.length > 10) history.pop();
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
}

export function getHistoryItem(id) {
    const history = loadHistory();
    return history.find(item => item.id === id);
}