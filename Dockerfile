FROM oven/bun:latest

WORKDIR /app
COPY package.json ./
RUN bun install
COPY . .

RUN bun build ./index.ts --compile --bytecode --minify --outfile=./dist/familyblur

EXPOSE 3000

CMD ["/app/dist/familyblur"]
