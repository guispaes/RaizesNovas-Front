// login.js
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const botao = e.target.querySelector('button');
    const msgErro = document.getElementById('mensagem-erro');

    botao.disabled = true;
    botao.textContent = "Verificando...";
    msgErro.classList.add('d-none');

    const dadosLogin = { username: usuario, passwordHash: senha };

    try {
        const response = await fetch('https://raizesnovas-api.onrender.com/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosLogin)
        });

        if (response.ok) {
            // Agora recebe o objeto do Java corretamente
            const usuarioLogado = await response.json(); 
            
            // PADRONIZAÇÃO: Salvamos usando a nomenclatura idUser do Java
            sessionStorage.setItem('admin_logado', 'true');
            sessionStorage.setItem('admin_id', usuarioLogado.idUser); 
            sessionStorage.setItem('admin_usuario', usuarioLogado.username); 
            
            window.location.href = 'admin.html';
        } else {
            msgErro.textContent = "Usuário ou senha incorretos.";
            msgErro.classList.remove('d-none');
            botao.disabled = false;
            botao.textContent = "Entrar";
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        msgErro.textContent = "Erro ao conectar com o servidor. Verifique o Render.";
        msgErro.classList.remove('d-none');
        botao.disabled = false;
        botao.textContent = "Entrar";
    }
});