var Contrato = require('../models/contrato')

module.exports.getContratos = () => {
    return Contrato
        .find()
        .exec()
}

module.exports.getContratoById = id => {
    return Contrato
        .findById(id)
        .exec()

    /**
     * return Contrato
     *    .findOne({_id : id})
     *    .exec() 
     */
}

module.exports.getContratosByEntidade = entidade => {
    return Contrato
        .find({entidade_comunicante : entidade})
        .exec()
}

module.exports.getContratosByTipo = tipo => {
    return Contrato
        .find({tipoprocedimento : tipo})
        .exec()
}

module.exports.getEntidades = () => {
    return Contrato
        .distinct('entidade_comunicante')
        .sort({entidade_comunicante : 1})
        .exec()
}

module.exports.getTipos = () => {
    return Contrato
        .distinct('tipoprocedimento')
        .sort({tipoprocedimento : 1})
        .exec()
}

module.exports.insert = contr => {
    var novo = new Contrato(contr)
    return novo.save()
}

module.exports.update = (id, contr) => {
    return Contrato
        .findByIdAndUpdate(id, contr, {new : true}) // devolve o objeto depois de ser atualizado
        .exec()
}

module.exports.delete = id => {
    return Contrato
        .findByIdAndDelete(id)
        .exec()
}

module.exports.getEntidadeByNipc = nipc => {
    return Contrato
        .find({NIPC_entidade_comunicante : nipc})
        .exec()
}