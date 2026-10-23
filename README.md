# Estadia — template completo de hospedagens

Template front-end responsivo para catálogo de hotéis, pousadas, chalés e imóveis de temporada.

## Estrutura

- `index.html` — estrutura semântica da página
- `css/styles.css` — estilos, layout responsivo e componentes
- `js/app.js` — dados demonstrativos, busca, filtros, ordenação, favoritos e modal de detalhes
- `assets/` — pasta reservada para imagens locais

## Como executar

1. Extraia o ZIP.
2. Abra `index.html` no navegador. Para desenvolvimento, recomenda-se a extensão Live Server do VS Code.
3. Edite os dados no array `stays`, no início de `js/app.js`.
4. Troque as imagens remotas por imagens próprias quando publicar.

## Funcionalidades incluídas

- Página inicial com banner e formulário de busca
- Busca por cidade, região, nome e tipo
- Filtros por categoria, preço máximo, tipo e piscina
- Ordenação por recomendação, preço e avaliação
- Cards responsivos de hospedagem
- Favoritos na sessão atual
- Modal com detalhes e comodidades
- Menu mobile
- Estados vazios e mensagens de feedback
- Acessibilidade básica: labels, aria attributes, skip link e foco visível

## Importante

É um protótipo front-end com dados, preços, avaliações e imagens ilustrativos. Não inclui backend, banco de dados, login real, disponibilidade em tempo real, pagamento nem reserva confirmada. Para uso comercial, conecte uma API/backend e substitua todo conteúdo demonstrativo por dados autorizados. Imagens do Unsplash são carregadas pela internet.
