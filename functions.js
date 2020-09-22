const historicoDePedidos = require('./lists/historicoDePedidos').historicoDePedidos;
const listaDeProdutos = require('./lists/listaDeProdutos').produtos


// procurar um produto específico na lista de produtos,
// a partir de sua ID
const procurarProduto = (idProcurada) => {
    let produto = false;

    listaDeProdutos.forEach(item => {
        if (parseInt(idProcurada) === item.id) {
            produto = item;
        };
    });
    
    return produto;
};

// adicionando um novo produto à lista de produtos
const adicionarNovoProdutoAListaDeProdutos = (corpoDaRequisicao) => {
    const novoProduto = {
        id: listaDeProdutos.length + 1,
        nome: corpoDaRequisicao.nome ? corpoDaRequisicao.nome : '-',
        quantidade: corpoDaRequisicao.quantidade ? corpoDaRequisicao.quantidade : '-',
        preco: corpoDaRequisicao.preco ? corpoDaRequisicao.preco : '-',
        deletado: false
    };

    // garantindo que todos os dados estão presentes
    if (novoProduto.nome === '-' || novoProduto.quantidade === '-' || novoProduto.preco === '-') {
        return false;
    } else {
        listaDeProdutos.push(novoProduto);
        return novoProduto;
    };
};

// atualiza as informacoes do produto
const atualizarProduto = (id, corpoDaRequisicao) => {
    const produto = procurarProduto(id);

    //caso o produto nao seja encontrado
    if (!produto) {
        return false;
    };

    // caso o produto esteja marcado como deletado,
    // ele nao pode ter seus dados atualizados
    if (produto.deletado) {
        return null;
    };

    // se o dado a ser atualizado for quantidade, a funcao vai somar ou diminuir o novo valor
    // se nao(nome, preco), vai trocar o valor antigo pelo novo
    if (corpoDaRequisicao.dadoASerAtualizado === 'quantidade') {
        produto.quantidade += Number(corpoDaRequisicao.novoValor);
    } else {
        produto[corpoDaRequisicao.dadoASerAtualizado] = corpoDaRequisicao.novoValor;
    };
    
    return produto;
};

// atualiza o status de deletado de um produto
const deletarProduto = (id) => {
    const produto = procurarProduto(id);

    if (!produto) {
        return false;
    }

    produto.deletado = true;
    return produto;
}


// busca todos os pedidos que se adequam ao filtro inserido
const buscarTodosOsPedidos = (estadoDoPedido) => {
    const listaFiltrada = [];
    
    // testo para ver se existe um filtro, caso nao exista, retorna todos os pedidos nao deletados
    if (estadoDoPedido === 'todos') {
        historicoDePedidos.forEach(pedido => {
            if (!pedido.deletado) {
                listaFiltrada.push(pedido);
            };
        });
    } else {
        historicoDePedidos.forEach(pedido => {
            if (!pedido.deletado && pedido.estado === estadoDoPedido) {
                listaFiltrada.push(pedido);
            };
        });
    }

    return listaFiltrada
}

//procura um pedido especifico, a aprtir de uma id
const procurarPedido = (id) => {
    let pedido = false;

    historicoDePedidos.forEach(item => {
        if (Number(id) === item.id) {
            pedido = item;
        };
    });

    return pedido;
};

// adiciona um novo pedido ao historico de pedidos
const adicionarNovoPedido = () => {
    const novoPedido = {
        id: historicoDePedidos.length + 1,
        produtos: [],
        estado: 'incompleto',
        idDoCliente: '5654654',
        deletado: false,
        valorTotal: 0,
    };

    historicoDePedidos.push(novoPedido);
    return novoPedido;
};

const deletarPedido = (id) => {
    const pedido = procurarPedido(id);

    if (!pedido) {
        return false;
    };

    pedido.deletado = true;
    return pedido;
};

module.exports = {
    procurarProduto: procurarProduto,
    adicionarNovoProdutoAListaDeProdutos: adicionarNovoProdutoAListaDeProdutos,
    atualizarProduto: atualizarProduto,
    deletarProduto: deletarProduto,
    buscarTodosOsPedidos: buscarTodosOsPedidos,
    procurarPedido: procurarPedido,
    adicionarNovoPedido: adicionarNovoPedido,
    deletarPedido: deletarPedido,

}