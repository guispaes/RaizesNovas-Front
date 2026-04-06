// Aguarda o HTML carregar completamente antes de rodar o código
document.addEventListener('DOMContentLoaded', () => {
    carregarArtigos();
});

async function carregarArtigos() {
    try {
        const resposta = await fetch('https://raizesnovas-api.onrender.com/api/artigos');
        
        if (!resposta.ok) throw new Error('Falha na resposta do servidor');

        const listaDeArtigos = await resposta.json();
        const grid = document.getElementById('grid-artigos');
        grid.innerHTML = ''; 

        if (listaDeArtigos.length === 0) {
            grid.innerHTML = '<p class="text-center w-100 fs-4 text-muted mt-5">Nenhum artigo publicado ainda.</p>';
            return;
        }

        // Cria um card novo para cada artigo
        listaDeArtigos.forEach(artigo => {
            
            // PADRONIZAÇÃO: Pega o nome da primeira palavra-chave do array
            let tagCategoria = 'Geral';
            if (artigo.palavrasChave && artigo.palavrasChave.length > 0) {
                tagCategoria = artigo.palavrasChave[0].palavraChave;
            }

            // PADRONIZAÇÃO: Usa artigo.idArtigo no link do botão e a tagCategoria no badge
            const cardHTML = `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-img-top d-flex justify-content-center align-items-center p-0 bg-light" style="height: 200px; overflow: hidden;">
                            <img src="${artigo.imagemHeader || 'assets/img/logo.png'}" alt="${artigo.titulo}" class="img-fluid w-100" style="object-fit: cover; min-height: 100%;">
                        </div>
                        <div class="card-body d-flex flex-column text-center">
                            <span class="badge bg-success mb-2 align-self-center">${tagCategoria}</span>
                            <h5 class="card-title fw-bold">${artigo.titulo}</h5>
                            <a href="artigo-detalhe.html?id=${artigo.idArtigo}" class="btn btn-success mt-auto w-75 mx-auto">Leia</a>
                        </div>
                    </div>
                </div>
            `;
                
            grid.innerHTML += cardHTML;
        });

    } catch (erro) {
        console.error("Erro ao conectar com a API:", erro);
        document.getElementById('grid-artigos').innerHTML = `
            <div class="col-12 text-center text-danger mt-5">
                <p>Não foi possível carregar os artigos no momento. Verifique sua conexão.</p>
            </div>
        `;
    }
}