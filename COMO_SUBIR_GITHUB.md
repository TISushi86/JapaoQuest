# Como subir o JapaoQuest no GitHub (usuário: TISushi86)

## Passo 1: Instalar o Git

O Git não está instalado no seu computador. Siga:

1. Baixe o Git: https://git-scm.com/download/win
2. Instale (pode deixar as opções padrão)
3. **Feche e abra o terminal/PowerShell** depois de instalar

---

## Passo 2: Criar o repositório no GitHub

1. Acesse: https://github.com/new
2. Faça login (usuário: **TISushi86**)
3. Em **Repository name**, digite: `JapaoQuest`
4. Deixe **Public**
5. **Não marque** "Add a README file" (o projeto já tem arquivos)
6. Clique em **Create repository**

---

## Passo 3: Subir o projeto

Abra o **PowerShell** na pasta do projeto e execute:

```powershell
cd C:\Users\William\Desktop\Japones\JapaoQuest

# Inicializar Git
git init
git branch -M main

# Adicionar arquivos
git add .
git commit -m "Projeto JapaoQuest - jogo de aprendizado de japones"

# Conectar ao seu GitHub
git remote add origin https://github.com/TISushi86/JapaoQuest.git

# Enviar
git push -u origin main
```

**Ou use o script automático:**

```powershell
cd C:\Users\William\Desktop\Japones\JapaoQuest
.\scripts\subir-github.ps1
```

---

## Se pedir usuário e senha

O GitHub não usa mais senha comum. Use:

- **Usuário:** TISushi86
- **Senha:** um **Personal Access Token** (PAT)

Para criar um token:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Marque `repo`
4. Copie o token e use como senha quando o Git pedir

---

## Depois de subir

Seu projeto estará em: **https://github.com/TISushi86/JapaoQuest**

Para atualizar no futuro:
```powershell
git add .
git commit -m "Descrição da alteração"
git push
```
