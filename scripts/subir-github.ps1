# Script para subir o JapaoQuest no GitHub
# Usuario: TISushi86
# Execute: .\scripts\subir-github.ps1

$ErrorActionPreference = "Stop"
$repoName = "JapaoQuest"
$githubUser = "TISushi86"
$repoUrl = "https://github.com/$githubUser/$repoName.git"

Write-Host "=== Subindo JapaoQuest para GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git esta instalado
try {
    $gitVersion = git --version
    Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Git nao encontrado!" -ForegroundColor Red
    Write-Host "Instale o Git em: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Depois feche e abra o terminal novamente." -ForegroundColor Yellow
    exit 1
}

# Ir para a pasta do projeto
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $projectRoot

# Inicializar Git (se nao existir)
if (-not (Test-Path ".git")) {
    Write-Host "Inicializando Git..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Verificar se remote ja existe
$remotes = git remote 2>$null
if ($remotes -notcontains "origin") {
    Write-Host "Adicionando remote origin..." -ForegroundColor Yellow
    git remote add origin $repoUrl
} else {
    Write-Host "Atualizando URL do remote origin..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Adicionar arquivos
Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
git add .

# Status
$status = git status --short
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Nenhuma alteracao para enviar. Projeto ja esta atualizado." -ForegroundColor Green
    Write-Host ""
    Write-Host "Para forcar o push: git push -u origin main" -ForegroundColor Gray
    exit 0
}

# Commit
Write-Host "Criando commit..." -ForegroundColor Yellow
git commit -m "Projeto JapaoQuest - jogo de aprendizado de japones"

# Push
Write-Host ""
Write-Host "IMPORTANTE: Crie o repositorio no GitHub antes de continuar!" -ForegroundColor Yellow
Write-Host "1. Acesse: https://github.com/new" -ForegroundColor White
Write-Host "2. Nome do repositorio: $repoName" -ForegroundColor White
Write-Host "3. Deixe em Public" -ForegroundColor White
Write-Host "4. NAO marque 'Add a README' - o projeto ja tem arquivos" -ForegroundColor White
Write-Host "5. Clique em Create repository" -ForegroundColor White
Write-Host ""
$confirma = Read-Host "Repositorio ja foi criado no GitHub? (s/n)"

if ($confirma -eq "s" -or $confirma -eq "S") {
    Write-Host "Enviando para GitHub..." -ForegroundColor Yellow
    git push -u origin main
    Write-Host ""
    Write-Host "=== Concluido! ===" -ForegroundColor Green
    Write-Host "Acesse: https://github.com/$githubUser/$repoName" -ForegroundColor Cyan
} else {
    Write-Host "Execute este script novamente apos criar o repositorio." -ForegroundColor Yellow
    Write-Host "Ou rode manualmente: git push -u origin main" -ForegroundColor Gray
}
