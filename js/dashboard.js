import { formatarMoeda } from './utils.js';

let pieChart = null;

export function atualizarCards(resumo) {
   document.getElementById('totalReceitas').innerText = formatarMoeda(resumo.totalReceitas);
    document.getElementById('totalDespesas').innerText = formatarMoeda(resumo.totalDespesas);
    document.getElementById('saldoTotal').innerText = formatarMoeda(resumo.saldo);
}

export function atualizarTabela(transacoes) {
    const tbody = document.getElementById('transacoesTableBody');
    if (!transacoes.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhuma transação encontrada</td></tr>';
        return;
    }
    tbody.innerHTML = transacoes.slice(0, 10).map(t => `
        <tr>
            <td>${t.descricao}</td>
            <td>${t.categoria}</td>
            <td>${formatarMoeda(t.valor)}</td>
            <td><span class="badge-${t.tipo === 'RECEITA' ? 'receita' : 'despesa'}">${t.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}</span></td>
            <td><button class="btn-icon" data-id="${t.id}"><i class="fas fa-trash-alt"></i></button></td>
        </tr>
    `).join('');
}

export function atualizarCategorias(transacoes) {
    const despesasPorCat = {};
    transacoes.filter(t => t.tipo === 'DESPESA').forEach(t => {
        despesasPorCat[t.categoria] = (despesasPorCat[t.categoria] || 0) + t.valor;
    });
    const totalDespesas = Object.values(despesasPorCat).reduce((a, b) => a + b, 0);
    const container = document.getElementById('categoriasList');
    if (!Object.keys(despesasPorCat).length) {
        container.innerHTML = '<p style="text-align:center;">Nenhuma despesa registrada</p>';
        return;
    }
    container.innerHTML = Object.entries(despesasPorCat).map(([cat, valor]) => {
        const percent = totalDespesas ? (valor / totalDespesas * 100).toFixed(1) : 0;
        return `
            <div class="categoria-item">
                <div style="flex:1">
                    <div><i class="fas fa-tag"></i> ${cat}</div>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%"></div></div>
                </div>
                <div class="categoria-valor">${formatarMoeda(valor)}</div>
                <div style="font-size:0.75rem;">${percent}%</div>
            </div>
        `;
    }).join('');
}

export function atualizarGraficoPizza(transacoes) {
    console.log('atualizarGraficoPizza chamado, total de transações:', transacoes.length);
    
    const canvas = document.getElementById('pieChart');
    if (!canvas) {
        console.error('Canvas #pieChart não encontrado!');
        return;
    }
    
    const despesas = transacoes.filter(t => t.tipo === 'DESPESA');
    console.log('Despesas encontradas:', despesas.length);
    
    if (despesas.length === 0) {
        console.log('Nenhuma despesa, limpando canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#64748b';
        ctx.font = '16px "Segoe UI"';
        ctx.fillText('Nenhuma despesa', canvas.width/2 - 70, canvas.height/2);
        return;
    }
    
    // Agrupar despesas por categoria
    const grupos = {};
    despesas.forEach(d => {
        grupos[d.categoria] = (grupos[d.categoria] || 0) + d.valor;
    });
    
    const labels = Object.keys(grupos);
    const data = Object.values(grupos);
    console.log('Labels:', labels);
    console.log('Dados:', data);
    
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico anterior se existir
    if (window.meuPieChart) {
        window.meuPieChart.destroy();
    }
    
    window.meuPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#4f46e5', '#a855f7', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec489a'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    
    console.log('Gráfico criado com sucesso');
}