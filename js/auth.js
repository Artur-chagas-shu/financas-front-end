const API_BASE = 'https://api.financasapp.eu.org/api'; // ou use a URL do túnel atual

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');

// Alternar entre formulários
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
}
if (showLoginLink) {
    showLoginLink.addEventListener('click', () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
}

// --------------------------------------------------------------
// LOGIN
// --------------------------------------------------------------
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
  
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;
    
    if (!email || !senha) {
        alert('Preencha email e senha');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro no login');
        }
        
        const data = await response.json();
        
      
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        
    
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Login error:', err);
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) errorDiv.innerText = err.message;
        else alert('Erro no login: ' + err.message);
    }
});

// --------------------------------------------------------------
// CADASTRO
// --------------------------------------------------------------
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('registerNome').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const senha = document.getElementById('registerSenha').value;
    
    if (!nome || !email || !senha) {
        alert('Preencha todos os campos');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro no cadastro');
        }
        
        const data = await response.json();
        alert(`Usuário criado com sucesso! ID: ${data.id}`);
        
    
        registerForm.reset();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        document.getElementById('loginEmail').value = email; 
    } catch (err) {
        console.error('Register error:', err);
        const errorDiv = document.getElementById('registerError');
        if (errorDiv) errorDiv.innerText = err.message;
        else alert('Erro no cadastro: ' + err.message);
    }
});


if (window.location.pathname.includes('login.html') && sessionStorage.getItem('token')) {
    window.location.href = 'index.html';
}