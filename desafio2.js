const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const { createContext } = require('vm');

const server = new Koa();

server.use(bodyparser());


const listaDeProdutos = [{
    id: 1,
    nome: 'coxinha',
    quantidade: 40,
    valor: 500,
    deletado: false
},{
    id: 2,
    nome: 'enroladinho',
    quantidade: 0,
    valor: 600,
    deletado: false
},{
    id: 3,
    nome: 'americano',
    quantidade: 30,
    valor: 550,
    deletado: true
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
        idDoProduto: 1,
        nome: 'coxinha',
        quantidade: 3,
        valor: 500
    },{
        idDoProduto: 2,
        nome: 'enroladinho',
        quantidade: 5,
        valor: 600
    }],
    estado: 'incompleto',
    idCliente: 152,
    deletado: false,
    valorTotal: 4500
},{
    id: 2,
    produtos: [{
        idDoProduto: 3,
        nome: 'americano',
        quantidade: 2,
        valor: 550
    },{
        idDoProduto: 4,
        nome: 'cheeseburguer',
        quantidade: 1,
        valor: 500,
    }],
    estado: 'processando',
    idCliente: 152,
    deletado: true,
    valorTotal: 1600
},{
    id: 3,
    produtos: [{
        idDoProduto: 1,
        nome: 'coxinha',
        quantidade: 3,
        valor: 500
    }],
    estado: 'pago',
    idCliente: 152,
    deletado: false,
    valorTotal: 1500
},{
    id: 4,
    produtos: [{
        idDoProduto: 1,
        nome: 'coxinha',
        quantidade: 3,
        valor: 500
    },{
        idDoProduto: 2,
        nome: 'enroladinho',
        quantidade: 3,
        valor: 600,
    },{
        idDoProduto: 4,
        nome: 'cheeseburguer',
        quantidade: 3,
        valor: 500
    }],
    estado: 'enviado',
    idCliente: 152,
    deletado: false,
    valorTotal: 4800
},{
    id: 5,
    produtos: [{
        idDoProduto: 1,
        nome: 'coxinha',
        quantidade: 50,
        valor: 500
    }],
    estado: 'entregue',
    idCliente: 152,
    deletado: false,
    valorTotal: 1500
},{
    id: 6,
    produtos: [{
        idDoProduto: 1,
        nome: 'coxinha',
        quantidade: 70,
        valor: 500
    }],
    estado: 'cancelado',
    idCliente: 152,
    deletado: true,
    valorTotal: 1500
},{
    id: 7,
    produtos: [{
        idDoProduto: 1,
        nome: 'coxinha',
        quantidade: 15,
        valor: 500
    }],
    estado: 'processando',
    idCliente: 152,
    deletado: false,
    valorTotal: 1500
},{
    id: 8,
    produtos: [{
        idDoProduto: 1,
        nome: 'coxinha',
        quantidade: 10,
        valor: 500
    }],
    estado: 'cancelado',
    idCliente: 152,
    deletado: false,
    valorTotal: 1500
}];

const calcularValorDoCarrinho = (carrinho) => {
    console.log(carrinho)
    let valor = 0;
    let produto;

    for (item of carrinho) {
        produto = buscarProduto(item.id);
        valor += item.quantidade * produto.valor;
    }

    return valor;    
};

const buscarProduto = (idProcurada) => {
    let produto;

    if (!isNaN(idProcurada)) {
        if (idProcurada <= listaDeProdutos.length) {
            listaDeProdutos.forEach(item => {
                if (item.id === idProcurada) {
                    produto = item;
                };
            });
            return produto
        } else {   
            return null;
        };
    } else {
        return false;
    }; 
};

const filtrarPedidos = (query) => {
    const listaFiltrada = [];
    const status = query.status

    if (status === 'incompleto' || status === 'processando' || status === 'pago' || status === 'enviado' || status === 'entregue' || status === 'cancelado') {
        if (status === 'todos') {
            historicoDePedidos.forEach(item => {
                if (!item.deletado) {
                    listaFiltrada.push(item);
                };
            });
        } else {
            historicoDePedidos.forEach(item => {
                if (!item.deletado && item.estado === status) {
                    listaFiltrada.push(item);
                };
            });
        };
        return listaFiltrada;
    } else {
        return false; 
    }

   
}

const buscarPedido = (idProcurada) => {
    let pedido;

    if (!isNaN(idProcurada)) {
        if (idProcurada <= historicoDePedidos.length) {
            historicoDePedidos.forEach(item => {
                if (item.id === idProcurada) {
                    pedido = item;
                };
            });
            return pedido;
        } else {   
            return null;
        };
    } else {
        return false;
    }; 
};

server.use(ctx => {
    const path = ctx.url;
    const method = ctx.method;

    if (method === 'POST') {   
        if (path === '/products') {
            const novoProduto = {                   // vou assumir que a verificacao dos dados seja feita no front end
                id: listaDeProdutos.length + 1,
                nome: ctx.request.body.nome,
                quantidade: parseInt(ctx.request.body.quantidade),
                valor: parseInt(ctx.request.body.valor),
                deletado: false
            };

            listaDeProdutos.push(novoProduto);
            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: novoProduto
            };
        } else if (path === '/orders') {
            const novoPedido = {
                id: historicoDePedidos.length + 1,
                produtos: [],
                estado: 'incompleto',
                idCliente: Math.floor(Math.random() * 100).toString(),
                deletado: false,
            }

            historicoDePedidos.push(novoPedido),
            ctx.body = {
                status: 'sucesso',
                dados: novoPedido
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'Caminho não encontrado'
                }
            };
        };
    } else if (method === "GET") {
        if (path.includes('/products/:')) {
            const produto = buscarProduto(parseInt(path.split('/:')[1]))

            if (typeof produto === 'object') {
                    if (!produto.deletado) {
                        ctx.body = {
                            status: 'sucesso',
                            dados: produto
                        };
                    } else {
                        ctx.status = 404;
                        ctx.body = {
                            status: 'error',
                            dados: {
                                mensagem: 'Produto deletado.'
                            }
                        };
                    };
            } else  if (/* id */ produto === null) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID não existente'
                    }
                };
            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inválido'
                    },
                };
            };
        } else if (path === '/products') {
            const produtosDisponiveis = []
            listaDeProdutos.forEach(produto => {
                if (!produto.deletado && produto.quantidade > 0) {
                    produtosDisponiveis.push(produto)
                }
            });
            ctx.status = 200,
            ctx.body = {
                status: 'sucesso',
                dados: produtosDisponiveis,
            };
        } else if (path.includes('/orders/:')) {
            const pedido = buscarPedido(parseInt(path.split('/:')[1]));

            if (pedido === null) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Não existe pedido para a ID solicitada'
                    }
                };
            } else if (!pedido) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'A ID não é válida'
                    }
                };
            } else {
                ctx.body = {
                    status: 'sucesso',
                    dados: pedido
                };
            };
        } else if (path.includes('/orders?')) {
            const query = ctx.query;
            const listaFiltrada = filtrarPedidos(query);

            if (!listaFiltrada) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'O status procurado é inválido'
                    }
                }
            } else {
                if (listaFiltrada.length > 0) {
                    ctx.body = {
                        status: 'Sucesso',
                        dados: listaFiltrada
                    }
                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'Não existem pedidos com este status.'
                        }
                    };
                };
            };
        } else {
            ctx.status = 404;
            ctx.body = ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'Caminho não encontrado'
                }
            };
        };
    } else if (method === "PUT") {
        if (path.includes('/products/:')) {
            const id = testarIDProdutos( parseInt( path.split('/:')[1] ) );

            if (typeof id === 'number') {
                const produto = buscarProduto(id);

                if (!produto.deletado) {
                    const dadoASerAtualizado = ctx.request.body.dadoASerAtualizado;
                    const novoValor = ctx.request.body.novoValor;
                    produto[dadoASerAtualizado] = novoValor;

                    ctx.status = 200;
                    ctx.body = {
                        status: 'sucesso',
                        dados: produto
                    };
                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 'error',
                        mensagem: 'O produto foi deletado, não pode ser atualizado'
                    }
                };
            } else if (id === null) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inexistente'
                    }
                };
            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inválido'
                    }
                };
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'Caminho não encontrado'
                }
            };
        };
    } else if (method === 'DELETE') {
        if (path.includes('/products/:')) {
            const id = testarIDProdutos( parseInt( path.split('/:')[1]))

            if (typeof id === 'number') {
                const produto = buscarProduto(id);
                produto.deletado = true;

                ctx.status = 200;
                ctx.body = {
                    status: 'sucesso',
                    dados: produto,
                };
            } else if (id === null) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inexistente'
                    }
                };
            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inválido'
                    }
                };
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'Caminho não encontrado'
                }
            };
        };
    } else {
        ctx.status = 404,
        ctx.body = {
            status: 'error',
            dados: {
                mensagem: 'Método não encontrado.'
            }
        };
    };
});

server.listen(8081, console.log('Servidor rodando sem problemas na porta 8081!'));