# Site Léo Imports Rio Branco

Página de links da Léo Imports. HTML, CSS e JavaScript puros: não precisa instalar nada.
Para ver no computador, abra o `index.html` no navegador.

## Estrutura

```
index.html            página e textos em português
.htaccess             compressão e cache na HostGator
llms.txt              resumo da loja para IAs (ChatGPT, Claude, Perplexity)
assets/css/style.css  visual: cores, fontes, espaçamentos
assets/js/i18n.js     textos em inglês
assets/js/main.js     idioma, tema claro/escuro, cursor, animações
assets/img/           foto, logo e banners
```

## Onde trocar cada coisa

| O quê | Onde |
|---|---|
| Textos em português | `index.html`. Os blocos editáveis têm comentário `EDITAR`. |
| Textos em inglês | `assets/js/i18n.js`. Cada chave corresponde a um `data-i18n="…"` no HTML. |
| Links (WhatsApp, Instagram, Maps, avaliação) | `index.html`: seção `REDES SOCIAIS`, botão principal, produtos e links. |
| Foto do topo | Troque `assets/img/foto.jpg` (quadrada, 336 × 336 px). |
| Logo | Troque `assets/img/logo.png` (branca, fundo transparente, tema escuro) e `assets/img/logo-dark.png` (escura, tema claro). |
| Banners dos produtos | Cada banner tem 2 arquivos com o mesmo desenho: `banner-N.jpg` (1200 × 540 px) e `banner-N-800.jpg` (800 × 360 px). Troque os dois. |
| Mapa | `index.html`, seção `MAPA`. Como trocar o local está no comentário. |
| Palavras da faixa rolando | `index.html`, em `.ticker`. Escreva cada palavra uma vez só. |
| Resumo para IAs | `llms.txt`. Atualize quando mudar produtos, links ou contato. |
| Cores da marca | `assets/css/style.css`, tokens `--brand*` no topo. |
| Título no Google e no compartilhamento | `<title>` e `<meta>` no topo do `index.html`. |

## Regras

- Se mudar um texto em português, mude também o inglês com a mesma chave no `i18n.js`.
- Para um texto novo traduzível, adicione `data-i18n="chave"` no HTML e a mesma `chave` no `i18n.js`.
- Nomes dos produtos não são traduzidos.
- O idioma e o tema escolhidos ficam salvos no navegador de cada visitante.

## Publicar na HostGator

Pronto para enviar: `publicar/leo-imports-site.zip` (e a mesma coisa descompactada em `publicar/leo-imports-site/`).
Ele já tem só os arquivos do site. Se mudar algo no projeto, gere o pacote de novo antes de publicar.

1. No cPanel, abra o **Gerenciador de Arquivos** e entre na pasta `public_html` (ou na pasta do domínio).
2. Envie **somente** isto, mantendo as pastas:
   - `index.html`
   - `.htaccess`
   - `llms.txt`
   - a pasta `assets` inteira
3. Não envie `.agents`, `.claude`, `skills-lock.json` nem este `LEIA-ME.md`. São arquivos de trabalho.
4. O `.htaccess` começa com ponto e fica oculto. No Gerenciador de Arquivos, ative "Mostrar arquivos ocultos" em Configurações.
5. Ative o SSL grátis do domínio no cPanel. Depois, no `.htaccess`, tire o `#` das 3 últimas linhas para forçar `https://`.
6. Abra o site no celular e teste os botões.

Depois de publicar, troque no `index.html` o `content="assets/img/banner-1.jpg"` do `og:image`
pelo endereço completo, por exemplo `https://seudominio.com.br/assets/img/banner-1.jpg`.
Sem isso, a imagem não aparece quando o link é compartilhado no WhatsApp.
