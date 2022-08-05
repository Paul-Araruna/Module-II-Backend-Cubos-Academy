const bancoDeDados = require('../bancodedados');


const validarSenha = (req, res, next) => {

    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(404).json({
            mensagem: "Senha não foi digitada"
        });
    }

    if (senha_banco !== 'Cubos123Bank') {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
    }
    next();
};

const validarDadosDeCadastro = (req, res, next) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Dados faltantes, por favor insira todos os dados: nome, cpf , data de nascimento , telefone, email e senha' });
    }

    const verificadorCPF = bancoDeDados.contas.find((elemento) => {
        return elemento.usuario.cpf === cpf;
    });

    const verificadorEmail = bancoDeDados.contas.find((elemento) => {
        return elemento.usuario.email === email;
    });

    if (verificadorCPF || verificadorEmail) {
        return res.status(401).json({
            mensagem: "Já existe uma conta com o cpf ou e-mail informado!"
        });
    }

    next();
};


const validarExclusao = (req, res, next) => {

    const { numeroConta } = req.params;

    const contaProcurada = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!contaProcurada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (contaProcurada.saldo != 0) {
        return res.status(403).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
    }

    next();

};

const validarDeposito = (req, res, next) => {

    const { numero_conta, valor } = req.body;

    if (valor <= 0) {
        return res.status(403).json({ mensagem: 'Não permitido valor zerado ou negativo' });
    }

    if (!numero_conta || !valor) {
        return res.status(404).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
    }

    const contaProcurada = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaProcurada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    next();
};

const validarSaque = (req, res, next) => {

    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(404).json({ mensagem: 'O número da conta, valor e senha são obrigatórios!' });
    }

    const contaProcurada = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaProcurada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (senha !== contaProcurada.usuario.senha) {
        return res.status(401).json({ mensagem: "A senha inválida" });
    }

    if (contaProcurada.saldo < valor) {
        return res.status(401).json({ mensagem: "Saldo insuficiente!" });
    }

    next();
};

const validarTransferencia = (req, res, next) => {

    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(404).json({ mensagem: 'O número da conta de origem, conta destino valor e senha são obrigatórios!' });
    }

    const contaOrigem = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    });

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Conta origem não encontrada' });
    }

    const contaDestino = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    });

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Conta destino não encontrada' });
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ mensagem: "A senha inválida" });
    }

    if (contaOrigem.saldo < valor) {
        return res.status(401).json({ mensagem: "Saldo insuficiente para a transferência" });
    }

    next();
};

const validarVerificacaoDeSaldoExtrato = (req, res, next) => {

    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(404).json({ mensagem: 'O número da conta e senha são obrigatórios!' });
    }

    const contaProcurada = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaProcurada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (senha !== contaProcurada.usuario.senha) {
        return res.status(401).json({ mensagem: "A senha inválida" });
    }

    next();
};




module.exports = {
    validarSenha,
    validarDadosDeCadastro,
    validarExclusao,
    validarDeposito,
    validarSaque,
    validarTransferencia,
    validarVerificacaoDeSaldoExtrato
}