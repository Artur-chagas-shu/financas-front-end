const API_BASE = 'https://financas-api-4.onrender.com/api';

async function apiRequest(endpoint, method, body = null) {
    const token = sessionStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (response.status === 401) {
        // Token inválido ou expirado -> redirecionar para login
        sessionStorage.removeItem('token');
        window.location.href = 'login.html';
        throw new Error('Sessão expirada, faça login novamente.');
    }
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Erro HTTP ${response.status}`);
    }
    if (method === 'DELETE') return;
    return response.json();
}

export async function getTransacoes() { return apiRequest('/transacoes', 'GET'); }
export async function getResumo() { return apiRequest('/transacoes/resumo', 'GET'); }
export async function createTransacao(data) { return apiRequest('/transacoes', 'POST', data); }

export async function deleteTransacao(id) {
    console.log('Deletando transação ID:', id);
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE}/transacoes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Status da resposta:', response.status);
    if (!response.ok) throw new Error(`Erro ${response.status}: ${await response.text()}`);



export async function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}