# Estágio 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia os arquivos de dependências e instala
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia o resto do código do projeto
COPY . .

# Roda o comando de build do NestJS
RUN yarn build

# Estágio 2: Imagem final de produção
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia apenas as dependências de produção da imagem de build
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copia a pasta 'dist' com o código compilado
COPY --from=builder /usr/src/app/dist ./dist

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# Comando para iniciar a aplicação em produção
CMD ["node", "dist/main"]