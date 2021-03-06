define('workflow/lg.ferias.controller', [
    'aaControls/jquery/3.2.1',
    'aaControls/lg.aa.header',
    'aaControls/lg.aa.toolbar',
    'aaControls/lg.aa.selecaoColaborador',
    'aaControls/lg.aa.globalizacao',
    'aaControls/lg.aa.validator',
    'aaControls/lg.aa.utils',
    'aaControls/lg.aa.block',
    'aaControls/lg.aa.messageBox',
    'workflow/lg.mock',
    'aaControls/lg.aa.switch',
    'aaControls/lg.aa.datepicker'

], function ($, Header, Toolbar, SelecaoDeColaborador, globalizacao, Validator, utils, block, messageBox, mock) {

    globalizacao.adicione(29074, 'Eu');

    var Controller = function ($el) {
        this.$el = $el;
        this._inicializar();
    };

    Controller.prototype = {

        _inicializar: function () {
            var _this = this;
            mock.iniciarMocks();

            this.header = new Header(this.$el.find('#header'), {
                foto: 'http://www.radiobob.si/media/cc960e8e-46b7-4c40-b436-4b1bc5b28f60.jpg',
                nome: 'Carlos A. Vaz de Farias',
                primeiraInformacao: 'Desenvolver na LG lugar de gente',
                segundaInformacao: 'Gestor: <strong class="lg-aa-texto--primario">Farley Silva</strong>',
                email: 'carlos.farias@lg.com.br',
                telefone: '11 3333 3333 / 11 9999 9999',
                facebook: 'https://www.facebook.com',
                twitter: 'https://www.twitter.com',
                linkedin: 'https://www.linkedin.com'

            });

            this.toolbar = new Toolbar(this.$el.find('#toolbar'), {
                descricao: 'Férias',
                icone: 'lg-aa-icon--ferias',
                botoes: [{
                    id: 'btnSelecaoColaborador',
                    icone: 'fa fa-users'
                }]
            });

            var selecaoColaborador = new SelecaoDeColaborador(this.$el.find('#selecaoColaborador'), {
                $elementoReferencia: this.$el.find('#btnSelecaoColaborador'),
                url: './colaboradores.json',
                codigoEmpresa: 1,
                matricula: 1,
                onPrepareDados: function (dados) {

                    if (dados.nomeCompleto) {
                        dados.nome = dados.nomeCompleto;
                    }
                    dados.responsivo = true;
                    _this.header.atualizarDados(dados);

                },
                onChange: function (dados) {
                    // Lógica da função
                },
                onResult: function (dados) {
                    // Lógica da função
                }
            });

            this.$el.find('#switchFeriasParceladas').lgSwitch({ habilitado: false });
            this.$el.find('#switchLancamentoFerias').lgSwitch({ toggle: true })
            this.$el.find('#switchDecimoTerceiroSalario').lgSwitch();
            this.$el.find('#switchAbonoPecuniario').lgSwitch({ toggle: true });

            this.$el.find('.lg-aa-datepicker').lgDatepicker();

            this.validator = new Validator(this.$el.find('#formFerias'), {
                rules: {
                    dataInicio: {
                        required: true
                    },
                    diasGozo: {
                        required: true,
                        digits: true,
                        min: 10,
                        max: 30
                    },
                    diasAbono: {
                        required: true,
                        digits: true,
                        range: [5, 10]
                    }
                },
                submitHandler: function (form, e) {

                    e.preventDefault();
                    block.bloquear(0);
                    var objFormulario = utils.formToJson(form);
                    $.post('ferias/salvar', objFormulario).done(function (data) {
                        _this.validator.verifiqueRespostaValidacao(data);

                        if (!data.possuiInconsistencia && !data.possuiAlertas) {
                            messageBox.sucesso("Sucesso", "Parabéns! Não há inconsistências no seu formulário, agora corre e faz o Profile!")
                        }

                        block.desbloquear();
                    });
                }
            });

        }
    };

    return Controller;
});
