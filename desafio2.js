const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

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
    produtos: [],
    estado: 'incompleto',
    idCliente: 152,
    deletado: false,
    valorTotal: 0
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
    valorTotal: 25000
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
    valorTotal: 35000
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
    valorTotal: 7500
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
    valorTotal: 5000
}];

const calcularValorDoCarrinho = (pedido) => {
    const carrinho = pedido.produtos;
    let valor = 0;

    carrinho.forEach(produto => {
        valor += produto.quantidade*produto.valor
    })

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

    if (status === 'incompleto' || status === 'processando' || status === 'pago' || status === 'enviado' || status === 'entregue' || status === 'cancelado' || status === 'todos') {
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

const adicionarProdutoAoPedido = (pedido, idProduto, quantidade) => {
    const produto = buscarProduto(idProduto);

    if (!produto) {
        return false
    } else {
        if (!produto.deletado && quantidade <= produto.quantidade) {
            let existente = false;
            for (let x = 0; x < pedido.produtos.length; x++) {
                if (pedido.produtos[x].id === idProduto) {
                    existente = true;
                    pedido.produtos[x].quantidade += quantidade;
                    produto.quantidade -= quantidade;
                };
            };

            if (!existente) {
                const produtoAserAdicionado = {
                    id: produto.id,
                    nome: produto.nome,
                    quantidade,
                    valor: produto.valor
                }; 
                pedido.produtos.push(produtoAserAdicionado);
            };
            pedido.valorTotal = calcularValorDoCarrinho(pedido)
            return true;
        } else {
            return null
        }
    };
};

const retirarProdutoDoPedido = (pedido, idProduto, quantidade) => {
    const produto = buscarProduto(idProduto);

    if (!produto) {
        return false
    } else {
        for (x = 0; x < pedido.produtos.length; x++) {
            if (pedido.produtos[x].id === idProduto) {
                if (pedido.produtos[x].quantidade <= quantidade) {
                    produto.quantidade += pedido.produtos[x].quantidade;
                    pedido.produtos.splice(x, 1);
                } else {
                    produto.quantidade += quantidade;
                    pedido.produtos[x].quantidade -= quantidade;
                };
            };
        };
        calcularValorDoCarrinho(pedido);
        return true;
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
            } else  if (produto === null) {
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
            const produto = buscarProduto(parseInt( path.split('/:')[1]));

            if (!produto) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inválido'
                    }
                };
            } else if (produto === null) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inexistente'
                    }
                };
            } else {
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
            }

            
        } else if (path.includes('/orders/:')) {
            const pedido = buscarPedido(parseInt(path.split('/:')[1]));

            if (!pedido) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID do pedido é inválida'
                    }
                };
            } else  if (pedido === null) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID do pedido é inexistente'
                    }
                };
            } else {    
                if (ctx.request.body.dadoASerAtualizado === 'estado') { 
                    if (pedido.estado === 'incompleto' && pedido.produtos.length === 0) {
                        ctx.status = 404;  // esse codigo ta errado!
                        ctx.body = {
                            status: 'error',
                            dados: {
                                mensagem: 'o carrinho está vazio, não é possível atualizar o estado do pedido.'
                            }
                        };
                    } else {
                        pedido[ctx.request.body.dadoASerAtualizado] = ctx.request.body.novoValor;
                        ctx.body = {
                            status: 'sucesso',
                            dados: pedido
                        }
                    };
                } else if (ctx.request.body.dadoASerAtualizado === 'produtos') {
                    if (pedido.estado === 'incompleto' && !pedido.deletado) {
                        if (ctx.request.body.acao === 'adicionar') {
                            const adicao = adicionarProdutoAoPedido(pedido, parseInt(ctx.request.body.idDoProduto), parseInt(ctx.request.body.quantidade))

                            if (adicao) {
                                ctx.body = {
                                    status: 'sucesso',
                                    dados: pedido
                                };
                            } else if (adicao === null) {
                                ctx.status = 403;
                                ctx.body = {
                                    status: 'error',
                                    dados: {
                                        mensagem: 'Este produto não pode ser adicionado'
                                    }
                                }
                            } else {
                                ctx.status = 404;
                                ctx.body = {
                                    status: 'error',
                                    dados: {
                                        mensagem: 'Produto não encontrado'
                                    }
                                } 
                            }
                        } else if (ctx.request.body.acao === 'retirar') {
                            const retirada = retirarProdutoDoPedido(pedido, parseInt(ctx.request.body.idDoProduto), ctx.request.body.quantidade);

                            if (!retirada) {
                                ctx.status = 403;
                                ctx.body = {
                                    status: 'error',
                                    dados: {
                                        mensagem: 'produto não encontrado.'
                                    }
                                } 
                            } else {
                                ctx.body = {
                                    status: 'sucesso',
                                    dados: pedido
                                };
                            };
                        };
                    } else {
                        ctx.status = 404; // esse status ta erradooo
                        ctx.body = {
                            status: 'error',
                            dados: {
                                mensagem: 'Não é mais permitido adicionar produtos neste pedido.'
                            }
                        };
                    };
                } else if (ctx.request.body.dadoASerAtualizado === 'id' || ctx.request.body.dadoASerAtualizado === 'idCliente' || ctx.request.body.dadoASerAtualizado === 'deletado' || corpoAtualizacao.dadoASerAtualizado === 'valorTotal') {
                    ctx.status = 404; // ta erradooo
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'Este dado não pode ser atualizado.'
                        }
                    };
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
            const produto = buscarProduto(parseInt( path.split('/:')[1]))

            if (!produto) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inválido'
                    }
                };
            } else if (produto === null) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inexistente'
                    }
                };
            } else {
                produto.deletado = true;

                ctx.status = 200;
                ctx.body = {
                    status: 'sucesso',
                    dados: produto,
                };
            }
        } else if (path.includes('/orders/:')) {
            const pedido = buscarPedido(parseInt(path.split('/:')[1]))

            if (!pedido) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inválido'
                    }
                };
            } else if (pedido === null) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'ID inexistente'
                    }
                };
            } else {
                pedido.deletado = true;

                ctx.body = {
                    status: 'sucesso',
                    dados: pedido
                }
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