import { getTransacoes, getResumo, logout } from './api.js';
import { atualizarCards, atualizarTabela, atualizarCategorias, atualizarGraficoPizza } from './dashboard.js';
import { showToast } from './utils.js';
import { initForms } from './forms.js';

// Verifica se está logado
if (!sessionStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// Exibe nome do usuário (opcional)
const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
if (usuario.nome) {
    const header = document.querySelector('.header-actions');
    const userSpan = document.createElement('span');
    userSpan.innerHTML = `<i class="fas fa-user"></i> ${usuario.nome}`;
    header.insertBefore(userSpan, document.getElementById('newTransactionBtn'));
}

// Botão logout
const logoutBtn = document.createElement('button');
logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
logoutBtn.className = 'btn-secondary';
logoutBtn.onclick = () => logout();
document.querySelector('.header-actions').appendChild(logoutBtn);

async function loadDashboardData() {
    try {
        const [transacoes, resumo] = await Promise.all([getTransacoes(), getResumo()]);
        atualizarCards(resumo);
        atualizarTabela(transacoes);
        atualizarCategorias(transacoes);
        atualizarGraficoPizza(transacoes);
    } catch (err) {
        showToast('Erro ao carregar dados: ' + err.message, true);
    }
}

// Tema escuro (já existente)
document.getElementById('themeToggle')?.addEventListener('change', (e) => {
    document.body.classList.toggle('dark', e.target.checked);
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initForms(loadDashboardData);
    loadDashboardData();
});