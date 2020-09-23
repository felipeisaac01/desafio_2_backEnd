const historicoDePedidos = [{
    id: 1,
    produtos: [],
    estado: 'incompleto',
    idDoCliente: 152,
    deletado: false,
    precoTotal: 0
},{
    id: 2,
    produtos: [{
        idDoProduto: 3,
        nome: 'hidrocor',
        quantidade: 2,
        preco: 120
    },{
        idDoProduto: 4,
        nome: 'marca-texto',
        quantidade: 1,
        preco: 200,
    }],
    estado: 'incompleto',
    idDoCliente: 152,
    deletado: false,
    precoTotal: 440
},{
    id: 3,
    produtos: [{
        idDoProduto: 1,
        nome: 'caneta',
        quantidade: 3,
        preco: 150
    }],
    estado: 'pago',
    idDoCliente: 152,
    deletado: false,
    precoTotal: 450
},{
    id: 4,
    produtos: [{
        idDoProduto: 1,
        nome: 'caneta',
        quantidade: 3,
        preco: 150
    },{
        idDoProduto: 2,
        nome: 'lápis',
        quantidade: 3,
        preco: 100,
    },{
        idDoProduto: 4,
        nome: 'marca-texto',
        quantidade: 3,
        preco: 200
    }],
    estado: 'enviado',
    idDoCliente: 152,
    deletado: false,
    precoTotal: 1350
},{
    id: 5,
    produtos: [{
        idDoProduto: 1,
        nome: 'caneta',
        quantidade: 50,
        preco: 150
    }],
    estado: 'entregue',
    idDoCliente: 152,
    deletado: false,
    precoTotal: 7500
},{
    id: 6,
    produtos: [{
        idDoProduto: 1,
        nome: 'caneta',
        quantidade: 70,
        preco: 150
    }],
    estado: 'cancelado',
    idDoCliente: 152,
    deletado: true,
    precoTotal: 10500
},{
    id: 7,
    produtos: [{
        idDoProduto: 1,
        nome: 'caneta',
        quantidade: 15,
        preco: 150
    }],
    estado: 'processando',
    idDoCliente: 152,
    deletado: false,
    precoTotal: 2250
},{
    id: 8,
    produtos: [{
        idDoProduto: 1,
        nome: 'caneta',
        quantidade: 10,
        preco: 150
    }],
    estado: 'cancelado',
    idDoCliente: 152,
    deletado: false,
    precoTotal: 1500
}];

module.exports = {
    historicoDePedidos: historicoDePedidos
}