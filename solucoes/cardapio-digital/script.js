// Aguarda o documento HTML ser completamente carregado para começar a rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // !!! MUITO IMPORTANTE: COLE A URL DA SUA API DO APPS SCRIPT AQUI DENTRO DAS ASPAS !!!
    const API_URL = 'https://script.google.com/macros/s/AKfycbxWixbImDeyOeBKm5PkD70a97g_KcY8jjAncwP01vyVnBrRdZKGo5ged3_mYKkPNdOf/exec';

    const loadingElement = document.getElementById('loading');
    const cardapioContainer = document.getElementById('cardapio-container');

    // Função para buscar os dados da nossa API
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na rede: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Esconde a mensagem de "carregando"
            loadingElement.style.display = 'none';
            
            // Agrupa todos os itens do cardápio pela sua categoria
            const categorias = data.cardapio.reduce((acc, item) => {
                const categoria = item.categoria || 'Outros'; // Se um item não tiver categoria, vai para "Outros"
                if (!acc[categoria]) {
                    acc[categoria] = [];
                }
                acc[categoria].push(item);
                return acc;
            }, {});

            // Para cada categoria, cria o HTML correspondente
            for (const nomeCategoria in categorias) {
                // Cria o título da categoria
                let categoriaHtml = `<h2 class="categoria-titulo">${nomeCategoria}</h2>`;
                
                // Adiciona cada item daquela categoria
                categorias[nomeCategoria].forEach(item => {
                    // Formata o preço para o padrão brasileiro (ex: 45.50 -> 45,50)
                    const precoFormatado = parseFloat(item.preco).toFixed(2).replace('.', ',');

                    categoriaHtml += `
                        <div class="item-cardapio">
                            <h5>${item.nome}</h5>
                            <p class="mb-1">${item.descricao}</p>
                            <strong>R$ ${precoFormatado}</strong>
                        </div>
                    `;
                });

                // Adiciona o HTML da categoria completa ao container principal
                cardapioContainer.innerHTML += categoriaHtml;
            }
        })
        .catch(error => {
            // Em caso de erro, exibe uma mensagem amigável
            loadingElement.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Ops!</strong> Não foi possível carregar o cardápio.
                    <p>${error.message}</p>
                </div>`;
            console.error('Erro ao buscar dados da API:', error);
        });
});
