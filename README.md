##

 📥 Clonar o repositório

Você pode clonar o projeto para sua máquina:  
git clone https://github.com/HenriquePrestes/frontend-repo
git clone https://github.com/HenriquePrestes/backend-repo

## ▶️ Passo a passo para executar o sistema

### 1. Preparar o ambiente
Instale previamente:
- `Java 21`
- `Maven`
- `Node.js`
- `PostgreSQL`

### 2. Criar o banco de dados
No PostgreSQL, crie o banco usado pelo projeto. No ambiente local, o nome configurado é `clinica_db_local`.

### 3. Configurar o backend
Abra a pasta do backend e confira o arquivo `src/main/resources/application-local.properties`.
Verifique se a conexão com o banco está correta e, se necessário, ajuste a senha do PostgreSQL.

Também confirme o arquivo `.env` do backend com as variáveis exigidas pelo projeto, como:
- `SPRING_PROFILES_ACTIVE=local`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SERVER_PORT`
- `BD_DATASOURCE_PASSWORD`

### 4. Iniciar o backend
Na pasta do backend, execute:

```bash
mvn spring-boot:run
```

Se preferir, também pode abrir o projeto em uma IDE e executar a classe principal do Spring Boot.

### 5. Configurar o frontend
Abra a pasta `frontend` e confira o arquivo `.env.example`.
Crie o arquivo `.env` com a URL correta da API, ajustando `VITE_API_BASE_URL` conforme a porta em que o backend estiver rodando.

### 6. Iniciar o frontend
Na pasta `frontend`, execute:

```bash
npm install
npm run dev
```

### 7. Acessar o sistema
Depois de subir o backend e o frontend, abra o endereço informado pelo Vite no terminal.

Aqui está o link para o site : https://frontend-repo-lugzhnjho-henriqueprestes-projects.vercel.app/home

### Observações sobre o schema do banco
- O projeto utiliza JPA/Hibernate com `spring.jpa.hibernate.ddl-auto=update` (veja `application-local.properties`), então as tabelas são criadas/atualizadas automaticamente a partir das entidades.
- Não há script SQL versionado no repositório. Se o avaliador solicitar um script, gere um dump do banco usado na demonstração e inclua `dump.sql` (ex.: `pg_dump -U postgres -d clinica_db_local > dump.sql`).




