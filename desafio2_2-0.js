//duvida em products --> post --> passar uma id desnecessaria
//duvida em products --> put --> funcao testar id


const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const server = new Koa();
server.use(bodyparser());

const listaDeProdutos = require('./lists/listaDeProdutos').produtos;  // lista com alguns produtos para teste
const historicoDePedidos = require('./lists/historicoDePedidos').historicoDePedidos;  // lista com alguns pedidos para teste
const funcoes = require('./functions')


server.use(ctx => {
    const path = ctx.url;
    const method = ctx.method;
    const id = path.split('/')[2];

    if (path.includes('/products')) {
        if (method === "GET") {
            // se a id for undefined, quer dizer que nenhuma id foi passada, entao retorna a lista de todos os produtos
            if (!id) {             
                ctx.status = 200;               
                ctx.body = {
                    status: 'sucesso',
                    dados: listaDeProdutos
                };
                return
            };
            // se o id passador for um caractere não numérico, dá erro de id invádida
            if (isNaN(id)) {                    
                ctx.status = 400;               
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'O ID é inválido'
                    }
                };
                return
            };


            const produto = funcoes.procurarProduto(id)
            //se o produto retornar false, é porque a id é válida, mas não existe produto cadastrado com ela
            if (!produto) {
                ctx.status =  404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Não existe produto para a ID inserida'
                    }
                };
                return;
            };


            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: produto
            };
            
        } else if (method === "PUT") {
            // se nao foi passada uma id
            if (!id) {
                ctx.status = 400;
                ctx.body = {
                    status: 'error',
                    dados: 'Não foi indentificada uma ID'
                }
                return;
            }

            // se o id passador for um caractere não numérico, dá erro de id invádida
            if (isNaN(id)) {                    
                ctx.status = 400;               
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'A ID é inválida'
                    }
                };
                return
            };

            const corpoRequisicao = ctx.request.body;

            // garante que nem a id nem o status de deletado serão alterados
            if (corpoRequisicao.dadoASerAtualizado === 'id' || corpoRequisicao.dadoASerAtualizado === 'deletado') {
                ctx.status = 403;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Este dado não pode ser atualizado'
                    }
                };
                return;
            };

            const produto = funcoes.atualizarProduto(id, corpoRequisicao)
            // se o produto retornar false, é porque a id é válida, 
            // mas não existe produto cadastrado com ela
            if (produto === false) {
                ctx.status =  404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Não existe produto para a ID inserida'
                    }
                };
                return;
            };
            // se o produto retornar null, é porque ele está marcado
            // como apagado, logo nao pode ser atualizado
            if (produto === null) {
                ctx.status = 403;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'O produto não pode ser atualizado pois foi deletado.'
                    }
                };
                return;
            };

            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: produto
            };
            
        } else if (method === "POST") {
            const corpoRequisicao = ctx.request.body
            const novoProduto = funcoes.adicionarNovoProdutoAListaDeProdutos(corpoRequisicao);

            if (!novoProduto) {
                ctx.status = 400;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Os dados inseridos são inválidos'
                    }
                };
                return
            };

            ctx.status = 201;
            ctx.body = {
                status: 'sucesso',
                dados: novoProduto
            };
        } else if (method === 'DELETE') {
            // se nao foi passada uma id
            if (id === undefined || id === '') {
                ctx.status = 400;
                ctx.body = {
                    status: 'error',
                    dados: 'Não foi indentificada uma ID'
                }
                return;
            };
            // se o id passador for um caractere não numérico, dá erro de id invádida
            if (isNaN(id)) {                    
                ctx.status = 400;               
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'A ID é inválida'
                    }
                };
                return
            };

            const produto = funcoes.deletarProduto(id);
            // se o produto retornar false, é porque a id é válida, 
            // mas não existe produto cadastrado com ela
            if (!produto) {
                ctx.status =  404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Não existe produto para a ID inserida'
                    }
                };
                return;
            };

            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: produto
            };

        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'Método não encontrado'
                }
            };
        };
    } else if (path.includes('/orders')) {
        if (method === "GET") {
            if (id === undefined || id === '') {
                const estadoDoPedido = ctx.query.estado
                const listaFiltrada = funcoes.buscarTodosOsPedidos(estadoDoPedido)
                
                if (estadoDoPedido !== 'todos' && estadoDoPedido !== 'incompleto' && estadoDoPedido !== 'processando' &&
                    estadoDoPedido !== 'pago' && estadoDoPedido !== 'enviado' && estadoDoPedido !== 'entregue' && 
                    estadoDoPedido !== 'cancelado') {
                        ctx.status = 400;
                        ctx.body = {
                            status: 'error',
                            dados: {
                                mensagem: 'O estado do pedido inserido como filtro não é válido'
                            }
                        };
                        return
                    };

                if (listaFiltrada.length === 0) {
                    ctx.status = 200;
                    ctx.body = {
                        status: 'sucesso',
                        dados: {
                            mensagem: 'Não existem pedidos para o estado inserido'
                        }
                    };
                    return;
                };

                ctx.status = 200,
                ctx.body = {
                    status: {
                        status: 'sucesso',
                        dados: listaFiltrada
                    }
                };
            } else {
                // se o id passador for um caractere não numérico, dá erro de id invádida
                if (isNaN(id)) {                    
                    ctx.status = 400;               
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'A ID é inválida'
                        }
                    };
                    return;
                };
                
                const pedido = funcoes.procurarPedido(id)
                //se o produto retornar false, é porque a id é válida, mas não existe produto cadastrado com ela
                if (!pedido) {
                    ctx.status =  404;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'Não existe pedido para a ID inserida'
                        }
                    };
                    return;
                };
                //se o produto estiver marcado como deletado, ele não pode ser exibido
                if (pedido.deletado) {
                    ctx.status = 403;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensgem: 'O pedido foi deletado.'
                        }
                    };
                    return
                };

                ctx.status = 200;
                ctx.body = {
                    status: 'sucesso',
                    dados: pedido 
                };
            };
        } else if (method === "POST") {
            const novoPedido = funcoes.adicionarNovoPedido();
            
            ctx.status = 201;
            ctx.body = {
                status: 'sucesso',
                dados: novoPedido
            };
        } else if (method === 'DELETE') {
            // se nao foi passada uma id
            if (id === undefined || id === '') {
                ctx.status = 400;
                ctx.body = {
                    status: 'error',
                    dados: 'Não foi indentificada uma ID'
                }
                return;
            };
            // se o id passador for um caractere não numérico, dá erro de id invádida
            if (isNaN(id)) {
                ctx.status = 400;               
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'A ID é inválida'
                    }
                };
                return;
            };


            const pedido = funcoes.deletarPedido(id);
            // caso a funcao retorne false, quer dizer que nao existe pedido para a id enviada
            if (!pedido) {
                ctx.status =  404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Não existe pedido para a ID inserida'
                    }
                };
                return;
            };


            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: pedido
            };
        } else if (method === 'PUT') {
            // se não foi passada uma id
            if (!id) {
                ctx.status = 400;
                ctx.body = {
                    status: 'error',
                    dados: 'Não foi indentificada uma ID'
                };
                return;
            };
            // se o id passador for um caractere não numérico, dá erro de id invádida
            if (isNaN(id)) {
                ctx.status = 400;               
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'A ID é inválida'
                    }
                };
                return;
            };


            const pedido = funcoes.procurarPedido(id);
            // caso a funcao retorne false, quer dizer que nao existe pedido para a id enviada
            if (!pedido) {
                ctx.status =  404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Não existe pedido para a ID inserida'
                    }
                };
                return;
            };
            // 
            if (pedido.deletado) {
                ctx.status = 403;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'O pedido não pôde ser atualizado pois foi deletado.'
                    }
                };
                return;
            };


            const dadoASerAtualizado = ctx.request.body.dadoASerAtualizado;
            // garantindo que dados que não podem ser modificados sejam barrados
            if (dadoASerAtualizado === 'id' || dadoASerAtualizado === 'idDoCliente' || dadoASerAtualizado === 'deletado' ||
            dadoASerAtualizado === 'precoTotal') {
                ctx.status = 403;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'O dado fornecido não pode ser atualizado.'
                    }
                };
                return;
            };


            // tratando o caminho para alteração de estado
            if (dadoASerAtualizado === 'estado') {
                const novoValor = ctx.request.body.novoValor;

                // não é possível fechar um carrinho vazio
                if (pedido.produtos.length === 0) {
                    ctx.status = 403;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'O carrinho está vazio. O estado do pedido não pode ser atualizado.'
                        }
                    };
                    return;
                };

                // não é possível reabrir um carrinho
                if (novoValor === 'incompleto') {
                    ctx.status = 403;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'O carrinho foi fechado. Não é possível reabri-lo'
                        }
                    };
                };

                historicoDePedidos[pedido.id-1].estado = novoValor;
                ctx.status = 200;
                ctx.body = {
                    status: 'sucesso',
                    dados: pedido
                };
                return;
            };


            // tratando o caminho para alteração do carrinho
            if  (dadoASerAtualizado === 'carrinho') {
                // se o estado do estado do pedido não for 'incompleto', não é possível adicionar produtos
                if (pedido.estado !== 'incompleto') {
                    ctx.status = 403;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'Não é possível adicionar mais produtos pois o carrinho foi fechado.'
                        }
                    };
                    return;
                };

                //testo se o estoque é suficiente para realizar o novo pedido
                const estoqueSuficiente = funcoes.testarNovoCarrinho(ctx.request.body.novoValor, pedido.produtos);
                // algum item do novo carrinho marcado como deletado
                if (estoqueSuficiente === undefined) {
                    ctx.status = 403;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'Algum item do carrinho foi deletado do catálogo.'
                        }
                    };
                    return;
                };
                // estoque de algum item insuficiente
                if (!estoqueSuficiente) {
                    ctx.status = 403;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'O estoque não é suficiente para realizar o pedido.'
                        }
                    };
                    return;
                };

                //devolvendo o carrinho antigo ao estoque
                funcoes.devolverCarrinhoAntigoAoEstoque(pedido.produtos);
                // abatendo do estoque as quantidades do carrinho novo
                funcoes.abaterCarrinhoNovoDoEstoque(ctx.request.body.novoValor);
                //calculando o valor do novo carrinho
                historicoDePedidos[pedido.id-1].precoTotal = funcoes.calcularPrecoDocarrinho(ctx.request.body.novoValor);
                // adicionando ao pedido o novo carrinho
                historicoDePedidos[pedido.id-1].produtos = ctx.request.body.novoValor;
                ctx.status = 200;
                ctx.body = {
                    status: 'sucesso',
                    dados: pedido
                }; 
                return; 
            };


            // caso dadoASerAlterado n seja nenhum dos campos do objeto pedido
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'O dado a ser alterado não foi encontrado.'
                }
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'Método não encontrado'
                }
            };
        };
    } else {
        ctx.status = 404;
        ctx.body = {
            status: 'error',
            dados: {
                mensagem: 'Caminho não encontrado.'
            }
        };
    };
});

server.listen(1908, console.log('O servidor está rodando na porta 1908!'));