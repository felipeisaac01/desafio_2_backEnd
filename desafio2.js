const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const server = new Koa();

server.use(bodyparser());


const produtosDisponiveis = [{
    id: 1,
    nome: 'coxinha',
    quantidade: 40,
    valor: 500,
    deletado: false
},{
    id: 2,
    nome: 'enroladinho',
    quantidade: 20,
    valor: 600,
    deletado: false
},{
    id: 3,
    nome: 'americano',
    quantidade: 30,
    valor: 550,
    deletado: false
},{
    id: 4,
    nome: 'cheeseburguer',
    quantidade: 40,
    valor: 500,
    deletado: false
},{
    id: 5,
    nome: 'açaí',
    quantidade: 15,
    valor: 800,
    deletado: false
},];

const historicoDePedidos = [{
    id: 1,
    produtos: [{
        id: 1,
        quantidade: 3
    },{
        id: 2,
        quantidade: 5
    }],
    estado: 'processando',
    idCliente: 152,
    deletado: false,
    valorTotal: 4500
},{
    id: 2,
    produtos: [{
        id: 3,
        quantidade: 2
    },{
        id: 4,
        quantidade: 1
    }],
    estado: 'entregue',
    idCliente: 152,
    deletado: false,
    valorTotal: 1600
},{
    id: 3,
    produtos: [{
        id: 1,
        quantidade: 3
    }],
    estado: 'pago',
    idCliente: 152,
    deletado: false,
    valorTotal: 1500
},{
    id: 4,
    produtos: [{
        id: 1,
        quantidade: 3
    },{
        id: 2,
        quantidade: 3
    },{
        id: 4,
        quantidade: 3
    }],
    estado: 'pago',
    idCliente: 152,
    deletado: false,
    valorTotal: 4800
}]

const calcularValorDoCarrinho = (carrinho) => {
    console.log(carrinho)
    let valor = 0;
    let produto;

    for (item of carrinho) {
        produto = buscarProduto(item.id);
        valor += item.quantidade * produto.valor;
    }

    return valor    
}

const buscarProduto = (idProcurada) => {
    let produto;

    produtosDisponiveis.forEach(item => {
        if (idProcurada === item.id) {
            produto = item;
        };
    });

    return produto
};


server.use(ctx => {
    const path = ctx.url
    const method = ctx.method;

    if (method === 'POST') {   
        if (path === '/products') {
            const novoProduto = {                   // vou assumir que a verificacao dos dados seja feita no frontend
                id: produtosDisponiveis.length + 1,
                nome: ctx.request.body.nome,
                quantidade: parseInt(ctx.request.body.quantidade),
                valor: parseInt(ctx.request.body.valor),
                deletado: false
            }

            produtosDisponiveis.push(novoProduto);
            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: novoProduto
            }
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'Caminho não encontrado'
                }
            }
        }
    } else {
        ctx.status = 404,
        ctx.body = {
            status: 'error',
            dados: {
                mensagem: 'Método não encontrado.'
            }
        }
    }

/* 
    const pedido = {
        id: historicoDePedidos.length + 1,
        produtos: [],
        estado: 'incompleto',
        idCliente: 1,
        deletado: false,
        // valorTotal: calcularValorDoCarrinho(pedidos.produtos),
    }; 
*/
})

server.listen(8081, console.log('Servidor rodando sem problemas na porta 8081!'))