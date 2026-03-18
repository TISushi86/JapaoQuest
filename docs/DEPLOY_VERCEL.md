# Passo a passo: Colocar o Japão Quest no Vercel

## Pré-requisitos

- Conta no [Vercel](https://vercel.com) (gratuita)
- [Node.js](https://nodejs.org) instalado no seu computador
- Projeto JapaoQuest funcionando localmente

---

## Método 1: Deploy via GitHub (recomendado)

### Passo 1: Criar conta no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** (mais fácil para projetos)
4. Autorize o Vercel a acessar sua conta do GitHub

### Passo 2: Colocar o projeto no GitHub

1. Crie uma conta no [GitHub](https://github.com) se ainda não tiver
2. Crie um novo repositório (ex.: `JapaoQuest`)
3. No terminal, dentro da pasta do projeto:

```bash
cd C:\Users\William\Desktop\Japones\JapaoQuest

# Inicializar Git (se ainda não fez)
git init

# Adicionar arquivos
git add .

# Primeiro commit
git commit -m "Projeto JapaoQuest"

# Conectar ao GitHub (troque SEU_USUARIO e SEU_REPO pelo seu)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

### Passo 3: Configurar o Vercel para o projeto

1. No Vercel, clique em **"Add New..."** → **"Project"**
2. Selecione o repositório **JapaoQuest** (ou o nome que você usou)
3. Clique em **"Import"**

### Passo 4: Ajustar as configurações de build

Antes de fazer o deploy, configure:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Other |
| **Build Command** | `npx expo export --platform web` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

4. Clique em **"Deploy"**

### Passo 5: Aguardar o deploy

- O Vercel vai instalar dependências, rodar o build e publicar
- Quando terminar, você recebe um link como: `https://japaoquest-xxx.vercel.app`

---

## Método 2: Deploy via linha de comando (sem GitHub)

### Passo 1: Instalar o Vercel CLI

Abra o PowerShell ou CMD e execute:

```bash
npm install -g vercel
```

### Passo 2: Gerar a versão web do jogo

```bash
cd C:\Users\William\Desktop\Japones\JapaoQuest

npx expo export --platform web
```

Aguarde até aparecer algo como "Export complete". Os arquivos serão gerados na pasta `dist`.

### Passo 3: Fazer o deploy

```bash
vercel dist
```

### Passo 4: Seguir as perguntas do Vercel

- **Set up and deploy?** → `Y` (sim)
- **Which scope?** → sua conta
- **Link to existing project?** → `N` (não)
- **Project name?** → `japaoquest` (ou outro nome)
- **Directory?** → `dist` (ou deixe em branco se já estiver na pasta dist)

### Passo 5: Copiar o link

No final, o Vercel mostra um link como:

```
https://japaoquest-xxx.vercel.app
```

Use esse link para acessar o jogo.

---

## Atualizar o jogo depois

### Se usou GitHub (Método 1)

1. Faça as alterações no código
2. Envie para o GitHub:

```bash
git add .
git commit -m "Atualização do jogo"
git push
```

O Vercel detecta o push e faz um novo deploy automaticamente.

### Se usou CLI (Método 2)

1. Faça as alterações no código
2. Gere de novo e faça o deploy:

```bash
npx expo export --platform web
vercel dist --prod
```

---

## Possíveis erros

### Erro: "expo-sqlite" ou módulo nativo

Se aparecer erro relacionado a `expo-sqlite` na web, pode ser necessário desativar ou adaptar esse módulo para a versão web. Avise se isso acontecer para ajustarmos o código.

### Erro: Página em branco

- Confirme que **Output Directory** está como `dist`
- Confirme que **Build Command** está como `npx expo export --platform web`

### Erro: "Command not found: vercel"

Execute de novo:

```bash
npm install -g vercel
```

E feche e abra o terminal antes de rodar `vercel` de novo.

---

## Resumo rápido

| Etapa | Ação |
|-------|------|
| 1 | Criar conta no Vercel |
| 2 | Subir o projeto no GitHub OU instalar Vercel CLI |
| 3 | Build: `npx expo export --platform web` |
| 4 | Deploy: conectar o repo no Vercel OU `vercel dist` |
| 5 | Usar o link gerado para acessar o jogo |
