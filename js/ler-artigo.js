document.addEventListener('DOMContentLoaded', () => {
    carregarArtigoDetalhado();
});

async function carregarArtigoDetalhado() {
    // 1. O truque de mestre: ler o parâmetro '?id=' da URL do navegador
    const urlParams = new URLSearchParams(window.location.search);
    const artigoId = urlParams.get('id');

    // Se o usuário tentou acessar a página direto sem clicar em um card
    if (!artigoId) {
        mostrarErro("Artigo não encontrado. Por favor, volte à lista de artigos.");
        return;
    }

    try {
        // 2. Faz o GET na sua API Java buscando um artigo específico pelo ID
        // Note que estamos usando a variável API_BASE_URL que criamos no api.js
        const resposta = await fetch(`${API_BASE_URL}/artigos/${artigoId}`);

        if (!resposta.ok) {
            throw new Error('Artigo não encontrado no banco de dados');
        }

        // 3. Converte a resposta do Java para objeto JavaScript
        const artigo = await resposta.json();

        // 4. Injeta os dados nos IDs correspondentes do seu HTML
        // Atenção: Os nomes 'titulo', 'conteudo', etc., devem ser EXATAMENTE iguais aos do seu modelo Java
        document.getElementById('artigo-titulo').textContent = artigo.titulo;
        
        // Usamos innerHTML no conteúdo caso o Java envie parágrafos formatados com tags <p> ou <br>
        document.getElementById('artigo-conteudo').innerHTML = artigo.conteudo;

        const imgElement = document.getElementById('artigo-imagem');
        if (imgElement) {
            imgElement.src = artigo.urlImagem || 'assets/img/Carrosel1.jpg'; // Imagem padrão caso não tenha no banco
            imgElement.alt = artigo.titulo;
        }

        // Altera o título da aba do navegador dinamicamente
        document.title = `${artigo.titulo} | Raízes Novas`;

    } catch (erro) {
        console.error("Erro ao carregar os detalhes do artigo:", erro);
        mostrarErro("Ocorreu um erro ao carregar o artigo. Tente novamente mais tarde.");
    }
}

// Função auxiliar para exibir uma mensagem bonita se algo der errado
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