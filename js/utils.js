export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

export function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const msgSpan = document.getElementById('toastMsg');
    msgSpan.textContent = message;
    toast.style.display = 'flex';
    toast.style.borderLeft = isError ? '4px solid var(--danger)' : '4px solid var(--success)';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}