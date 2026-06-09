# Guia de Contribuição - Whitelabel 
## 📥 Clonar o repositório
Antes de tudo, clone o projeto para sua máquina:  
git clone https://github.com/Plataforma-Saude/frontend-plataforma-saude.git

Acesse a pasta:
cd nome-do-repositorio

## 🌿 Criar uma nova branch
Sempre crie sua branch a partir da main.  

### **O padrão de nome será:**  
**feature/f-XX** → para novas funcionalidades  
**fix/f-XX** → para correções  
**hotfix/f-XX** → para correções urgentes em produção  

Onde f é de frontend e XX é o número da task no kanban.Exemplo: Task #5 → feature/f-05
Passos:

### **Atualize sua main:**  
git checkout main  
git pull origin main


Crie sua branch:

git checkout -b feature/f-05

## 💻 Trabalhar na sua branch
Faça as alterações necessárias e adicione os arquivos:  

git add .

Faça commits descritivos:  

git commit -m "feat: adiciona componente de login (task #5)"

## ⬆️ Enviar branch para o repositório remoto
git push origin feature/f-05

## 🔄 Atualizar branch com a main antes do Pull Request (PR)
Quando a branch `main` foi atualizada enquanto você ainda estava trabalhando em uma outra branch, o procedimento recomendado é seguir os passos abaixo para garantir que sua branch esteja sincronizada com as últimas alterações da `main`:

1 - **Atualize a branch `main`**: Antes de fazer qualquer coisa, volte para a branch `main` e garanta que ela tenha todas as atualizações mais recentes:
- `git checkout main` 
- `git pull origin main` (ou só `git pull`)

2 - **Mescle a branch `main` na branch que está trabalhando**: Agora, volte para a branch que está trabalhando e faça a mesclagem da branch `main` para trazer as atualizações:

- `git checkout {nome da branch que estava trabalhando}`
- `git merge main`

Isso vai mesclar as mudanças da `main` para a branch que está trabalhando. Caso existam conflitos, o Git vai alertar, e você poderá resolvê-los manualmente.

3 - **Resolva conflitos (se houver)**: Se surgirem conflitos durante a mesclagem, o Git indicará os arquivos conflitantes. Você precisará editar esses arquivos, resolver os conflitos e, em seguida, fazer um commit:
- `git add <arquivo_resolvido>` 
- `git commit`

## 🔀 Criar Pull Request (PR)

Acesse o repositório no GitHub.  
Clique em Compare & Pull Request.  
Descreva as alterações feitas.  
Relacione a task correspondente.   

Resolva conflitos se houver, depois:
git add .  
git commit -m "merge main into feature/f-05"  

## ✅ Fluxo Resumido
git clone ...  
git checkout main  
git pull origin main  
git checkout -b feature/f-XX  
# Alterar código
git add .  
git commit -m "mensagem"  
git push origin feature/f-XX  
# Criar Pull Request
