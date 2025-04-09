# Usa a imagem oficial do nginx
FROM nginx:alpine

# Copia os arquivos do projeto para dentro do nginx
COPY . /usr/share/nginx/html

# Expondo a porta padrão do nginx
EXPOSE 80
# Comando para iniciar o nginx