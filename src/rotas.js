const express = require('express');
const intermediario = require('./intermediários/intermediarios');
const controlador = require('./controladores/controladores');

const rotas = express();


rotas.get('/contas', intermediario.validarSenha, controlador.listarContaBancaria);
rotas.post('/contas', intermediario.validarDadosDeCadastro, controlador.criarContaBancaria);
rotas.put('/contas/:numeroConta/usuario', intermediario.validarDadosDeCadastro, controlador.atualizarContaBancaria);
rotas.delete('/contas/:numeroConta', intermediario.validarExclusao, controlador.excluirConta);
rotas.post('/transacoes/depositar', intermediario.validarDeposito, controlador.depositar);
rotas.post('/transacoes/sacar', intermediario.validarSaque, controlador.sacar);
rotas.post('/transacoes/transferir', intermediario.validarTransferencia, controlador.transferir);
rotas.get('/contas/saldo', intermediario.validarVerificacaoDeSaldoExtrato, controlador.saldo);
rotas.get('/contas/extrato', intermediario.validarVerificacaoDeSaldoExtrato, controlador.emitirExtrato);


module.exports = rotas;