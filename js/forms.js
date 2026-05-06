import { createTransacao, deleteTransacao } from './api.js';
import { showToast } from './utils.js';

const modal = document.getElementById('modal');
const form = document.getElementById('transactionForm');
let loadCallback = null;

export function initForms(onDataLoaded) {
    loadCallback = onDataLoaded;
    document.getElementById('newTransactionBtn').onclick = () => modal.style.display = 'flex';
    document.querySelector('.close').onclick = () => {
        modal.style.display = 'none';
        form.reset();
    };
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    
    form.onsubmit = async (e) => {
        e.preventDefault();
        const descricao = document.getElementById('descricao').value;
        const valor = parseFloat(document.getElementById('valor').value);
        const tipo = document.getElementById('tipo').value;
        const categoria = document.getElementById('categoria').value;
        if (!descricao || isNaN(valor)) {
            showToast('Preencha todos os campos', true);
            return;
        }
        try {
            await createTransacao({ descricao, valor, tipo, categoria });
            modal.style.display = 'none';
            form.reset();
            if (loadCallback) await loadCallback();
            showToast('Transação adicionada!');
        } catch (err) {
            showToast('Erro: ' + err.message, true);
        }
    };
}

export function setupDeleteButtons(callback) {
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            if (id && confirm('Excluir?')) {
                await deleteTransacao(parseInt(id));
                if (callback) await callback();
                showToast('Removido');
            }
        };
    });
}