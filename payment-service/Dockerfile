# Usar uma imagem base do Node.js
FROM node:18-alpine

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos
COPY . .

# Construir o projeto
RUN npm run build

# Expor a porta que o serviço irá usar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "dist/main"]
