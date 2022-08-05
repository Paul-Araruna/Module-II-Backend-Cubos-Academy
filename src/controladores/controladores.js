const { format } = require('date-fns');
const bancoDeDados = require('../bancodedados');

let contadorDeCriacaoDeConta = 1;

const listarContaBancaria = (req, res) => {

    return res.status(200).json(bancoDeDados.contas);
};

const criarContaBancaria = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const novaConta = {
        numero: contadorDeCriacaoDeConta++,
        saldo: 0,
        usuario: {
            nome: nome,
            cpf: cpf,
            data_nascimento: data_nascimento,
            telefone: telefone,
            email: email,
            senha: senha
        }
    }

    bancoDeDados.contas.push(novaConta);

    return res.status(201).send();
};

const atualizarContaBancaria = (req, res) => {

    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const contaProcurada = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!contaProcurada) {
        res.status(404).json({ mensagem: 'Conta não encontrada' });
    }


    contaProcurada.usuario.nome = nome;
    contaProcurada.usuario.cpf = cpf;
    contaProcurada.usuario.data_nascimento = data_nascimento;
    contaProcurada.usuario.telefone = telefone;
    contaProcurada.usuario.email = email;
    contaProcurada.usuario.senha = senha;

    return res.status(204).send();

};

const excluirConta = (req, res) => {

    const { numeroConta } = req.params;

    bancoDeDados.contas = bancoDeDados.contas.filter((conta) => {
        return conta.numero !== Number(numeroConta);
    });

    return res.status(204).send();
};

const depositar = (req, res) => {

    const { numero_conta, valor } = req.body;

    const contaProcurada = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    contaProcurada.saldo = contaProcurada.saldo + valor;

    const registroDeDeposito = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta: numero_conta,
        valor: valor
    }

    bancoDeDados.depositos.push(registroDeDeposito);

    return res.status(201).send();
};

const sacar = (req, res) => {

    const { numero_conta, valor } = req.body;

    const contaProcurada = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    contaProcurada.saldo = contaProcurada.saldo - valor;

    const registroDeSaque = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta: numero_conta,
        valor: valor
    }

    bancoDeDados.saques.push(registroDeSaque);

    return res.status(201).send();
};

const transferir = (req, res) => {

    const { numero_conta_origem, numero_conta_destino, valor } = req.body;

    const contaOrigem = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    });

    const contaDestino = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    });

    contaOrigem.saldo = contaOrigem.saldo - valor;
    contaDestino.saldo = contaDestino.saldo + valor;

    const registroDeTransferencia = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor
    }

    bancoDeDados.transferencias.push(registroDeTransferencia);

    return res.status(201).send();
};

const saldo = (req, res) => {

    const { numero_conta } = req.query;

    const contaProcurada = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    return res.status(200).json({ saldo: contaProcurada.saldo });
};

const emitirExtrato = (req, res) => {

    const { numero_conta } = req.query;

    const contaProcurada = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    const historicoDeDepositos = bancoDeDados.depositos.filter((deposito) => {
        return deposito.numero_conta === contaProcurada.numero;
    });

    const historicoDeSaques = bancoDeDados.saques.filter((saque) => {
        return saque.numero_conta === contaProcurada.numero;
    });

    const transferenciasEnviadas = bancoDeDados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === contaProcurada.numero;
    });

    const transferenciasRecebidas = bancoDeDados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === contaProcurada.numero;
    });

    return res.status(200).json({
        depositos: historicoDeDepositos,
        saques: historicoDeSaques,
        transferenciasEnviadas: transferenciasEnviadas,
        transferenciasRecebidas: transferenciasRecebidas
    });

};



module.exports = {
    listarContaBancaria,
    criarContaBancaria,
    atualizarContaBancaria,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    emitirExtrato
};