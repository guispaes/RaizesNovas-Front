// admin.js
const IMGBB_API_KEY = '2ee3edb7ba6eec01b7372da33e576c15'; 

// ==========================================
// 1. CARREGAMENTO DO DROPDOWN (PALAVRAS-CHAVE)
// ==========================================
async function carregarPalavrasChave() {
    const select = document.getElementById('palavra-chave');
    if (!select) return;

    try {
        const response = await fetch(`${API_BASE_URL}/categorias`);
        const categorias = await response.json();

        if (categorias && categorias.length > 0) {
            select.innerHTML = '<option value="" selected disabled>Selecione uma Palavra-chave...</option>';
            
            categorias.forEach(cat => {
                const option = document.createElement('option');
                // PADRONIZAÇÃO: Pegamos o idPalavraChave exato do Java Categoria.java
                option.value = cat.idPalavraChave; 
                option.textContent = cat.palavraChave;
                option.style.color = "black"; 
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error("Erro ao carregar palavras-chave:", err);
    }
}

// ==========================================
// 2. UPLOAD DE IMAGEM (ImgBB)
// ==========================================
async function fazerUploadImagem(arquivo) {
    if (!arquivo) return null;
    const formData = new FormData();
    formData.append('image', arquivo);
    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.success ? data.data.url : null;
    } catch (error) {
        console.error("Erro no upload ImgBB:", error);
        return null;
    }
}

// ==========================================
// 3. ENVIO DO FORMULÁRIO (PADRONIZADO)
// ==========================================
document.getElementById('form-artigo').addEventListener('submit', async (e) => {
    e.preventDefault();

    const idPC = document.getElementById('palavra-chave').value;
    if (!idPC) { alert("Por favor, selecione uma Palavra-chave!"); return; }

    const botaoSalvar = e.target.querySelector('button');
    const textoOriginal = botaoSalvar.textContent;
    botaoSalvar.disabled = true;
    
    // Pegando o ID do autor diretamente do sessionStorage que o login.js acabou de salvar
    const idAutorReal = sessionStorage.getItem('admin_id');
    if (!idAutorReal) {
        alert("Sessão expirada. Faça login novamente.");
        fazerLogout(); // Chama a função do seu auth.js
        return;
    }

    botaoSalvar.textContent = "Enviando imagem...";
    const urlImagem = await fazerUploadImagem(document.getElementById('imagem-capa').files[0]);

    if (!urlImagem) {
        alert("Erro ao processar a imagem de capa.");
        botaoSalvar.disabled = false;
        botaoSalvar.textContent = textoOriginal;
        return;
    }

    botaoSalvar.textContent = "Salvando no banco...";

    // MONTAGEM PERFEITA (O JSON espelha exato o Artigo.java)
    const dadosArtigo = {
        titulo: document.getElementById('titulo').value,
        conteudo: tinymce.get('conteudo-artigo').getContent(),
        imagemHeader: urlImagem, 
        statusVisibilidade: "PUBLICADO",
        
        // PONTO 2 RESOLVIDO: Usa idUser (do Administrador.java) e o valor dinâmico
        autor: {
            idUser: parseInt(idAutorReal)
        },
        
        // PONTO 2 RESOLVIDO: Usa idPalavraChave (da Categoria.java)
        palavrasChave: [
            { idPalavraChave: parseInt(idPC) }
        ],
        
        dataCriacao: new Date().toISOString()
    };

    console.log("Payload padronizado enviado ao Java:", dadosArtigo);

    try {
        const response = await fetch(`${API_BASE_URL}/artigos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosArtigo)
        });

        if (response.ok) {
            alert("Sucesso! Artigo Raízes Novas publicado.");
            window.location.reload(); 
        } else {
            console.error("Erro 500. Verifique se o banco de dados Oracle reiniciou as sequences.");
            alert("Erro do Servidor. O Oracle recusou o salvamento.");
        }
    } catch (err) {
        alert("Não foi possível conectar ao servidor.");
    } finally {
        botaoSalvar.disabled = false;
        botaoSalvar.textContent = textoOriginal;
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', carregarPalavrasChave);