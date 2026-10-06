# EXATTA — Análises Clínicas

Site institucional da EXATTA — Análises Clínicas, desenvolvido com React e Vite.

## Tecnologias

- React 18
- Vite
- JavaScript
- CSS
- Lucide React
- React Icons

## Desenvolvimento

```bash
npm install
npm run dev
```

O Vite inicia o projeto normalmente em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

O projeto gera a pasta `dist/`, que é criada automaticamente e não deve ser versionada no Git.

## Publicação

### GitHub

Suba o projeto sem a pasta `node_modules` e sem `dist`. O arquivo `.gitignore` já cobre esses diretórios e arquivos locais.

### Vercel

O projeto está configurado para Vercel com `vercel.json`, incluindo o rewrite necessário para as rotas internas do site.

Na Vercel, use:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## Configurações do site

Os dados institucionais ficam em `src/config.js`, incluindo telefone, WhatsApp, e-mail, endereço, Instagram e link de resultados.

Os exames oficiais ficam em `src/examsData.js`.

## Estrutura principal

```text
exatta-analises-clinicas/
├── public/
│   ├── images/
│   └── exatta-favicon.png
├── src/
│   ├── App.jsx
│   ├── config.js
│   ├── examsData.js
│   ├── main.jsx
│   ├── styles.css
│   └── useScrollReveal.js
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```
