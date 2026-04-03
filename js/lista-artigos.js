// Aguarda o HTML carregar completamente antes de rodar o código
document.addEventListener('DOMContentLoaded', () => {
    carregarArtigos();
});

async function carregarArtigos() {
    try {
        // 1. Chama a sua API Java (Ajuste o '/api/artigos' se o seu Controller for diferente)
        const resposta = await fetch('http://localhost:8080/api/artigos');
        
        if (!resposta.ok) {
            throw new Error('Falha na resposta do servidor');
        }

        // 2. Converte o JSON do Spring Boot para um array do JavaScript
        const listaDeArtigos = await resposta.json();
        
        // 3. Pega a div vazia do HTML
        const grid = document.getElementById('grid-artigos');
        grid.innerHTML = ''; // Limpa o "spinner" de carregando

        // 4. Cria um card novo para cada artigo que veio do banco de dados
        listaDeArtigos.forEach(artigo => {
            
            // Usamos a crase (Template Literal) para injetar variáveis dentro do HTML
            const cardHTML = `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-img-top d-flex justify-content-center align-items-center p-4 bg-light" style="height: 200px;">
                            <img src="${artigo.urlImagem || 'assets/img/logo.png'}" alt="${artigo.titulo}" class="img-fluid" style="max-height: 80px;">
                        </div>
                        <div class="card-body d-flex flex-column text-center">
                            <h5 class="card-title fw-bold">${artigo.titulo}</h5>
                            <p class="card-text text-muted">${artigo.resumo || 'Clique para ler mais sobre esta instituição.'}</p>
                            <a href="artigo-detalhe.html?id=${artigo.id}" class="btn btn-success mt-auto w-75 mx-auto">Leia</a>
                        </div>
                    </div>
                </div>
            `;
            
            // Adiciona o card gerado na tela
            grid.innerHTML += cardHTML;
        });

    } catch (erro) {
        console.error("Erro ao conectar com a API:", erro);
        document.getElementById('grid-artigos').innerHTML = `
            <div class="col-12 text-center text-danger">
                <p>Não foi possível carregar os artigos no momento. Verifique se o servidor está rodando.</p>
            </div>
        `;
    }
}