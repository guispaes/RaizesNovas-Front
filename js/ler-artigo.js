document.addEventListener('DOMContentLoaded', () => {
    carregarArtigoDetalhado();
});

async function carregarArtigoDetalhado() {
    // 1. Captura o ID do artigo na URL (?id=...)
    const urlParams = new URLSearchParams(window.location.search);
    const artigoId = urlParams.get('id');

    if (!artigoId) {
        mostrarErro("Artigo não encontrado. Por favor, volte à lista de artigos.");
        return;
    }

    try {
        // 2. Chamada para a API no Render buscando o ID específico (Agora o Java aceita!)
        const resposta = await fetch(`https://raizesnovas-api.onrender.com/api/artigos/${artigoId}`);

        if (!resposta.ok) {
            throw new Error('Artigo não encontrado no banco de dados');
        }

        const artigo = await resposta.json();

        // 3. Injeta os dados no HTML 
        const tituloElem = document.getElementById('artigo-titulo');
        const conteudoElem = document.getElementById('artigo-conteudo');
        const imgElem = document.getElementById('artigo-imagem');
        const instElem = document.getElementById('artigo-instituicao'); 

        if (tituloElem) tituloElem.textContent = artigo.titulo;
        
        // Renderiza o HTML vindo do TinyMCE
        if (conteudoElem) conteudoElem.innerHTML = artigo.conteudo;

        // PADRONIZAÇÃO: Puxando o nome da palavra-chave ao invés de "instituicao"
        if (instElem) {
            let nomePalavraChave = 'Geral';
            if (artigo.palavrasChave && artigo.palavrasChave.length > 0) {
                nomePalavraChave = artigo.palavrasChave[0].palavraChave;
            }
            instElem.textContent = nomePalavraChave;
        }

        if (imgElem) {
            imgElem.src = artigo.imagemHeader || 'assets/img/logo.png';
            imgElem.alt = artigo.titulo;
        }

        // Altera o título da aba do navegador dinamicamente
        document.title = `${artigo.titulo} | Raízes Novas`;

    } catch (erro) {
        console.error("Erro ao carregar os detalhes do artigo:", erro);
        mostrarErro("Ocorreu um erro ao carregar a matéria. Verifique sua conexão.");
    }
}

// Função para exibir o alerta de erro bonitinho na tela
function mostrarErro(mensagem) {
    const container = document.getElementById('conteudo-principal');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-warning text-center my-5" role="alert">
                <h4 class="alert-heading fw-bold">Ops!</h4>
                <p>${mensagem}</p>
                <hr>
                <a href="artigos.html" class="btn btn-success mt-3">Voltar para os Artigos</a>
            </div>
        `;
    }
}