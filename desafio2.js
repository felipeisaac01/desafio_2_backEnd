const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const server = new Koa();

server.use(bodyparser());

server.use(ctx => {
    
})

server.listen(8081, console.log('Servidor rodando sem problemas na porta 8081!'))