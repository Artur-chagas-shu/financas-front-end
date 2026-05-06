const API_BASE = 'http://140.238.178.104:8080/api';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');


showRegisterLink.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});
showLoginLink.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});


loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro no login');
        }
        const data = await response.json();
      
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        window.location.href = 'index.html';
    } catch (err) {
        document.getElementById('loginError').innerText = err.message;
    }
});


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('registerNome').value;
    const email = document.getElementById('registerEmail').value;
    const senha = document.getElementById('registerSenha').value;
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro no cadastro');
        }
        alert('Cadastro realizado com sucesso! Faça login.');
        // Limpa e mostra login
        registerForm.reset();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    } catch (err) {
        document.getElementById('registerError').innerText = err.message;
    }
});

// Se já estiver logado, redirecionar para dashboard
if (sessionStorage.getItem('token')) {
    window.location.href = 'index.html';
}