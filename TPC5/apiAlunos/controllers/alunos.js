var Aluno = require('../models/aluno')

module.exports.list = () => {
    return Aluno
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = (id) => {
    return Aluno
        .findOne({_id : id})
        .exec()
}

module.exports.insert = async (aluno) => {
    console.log(aluno)
    const existingAluno = await Aluno.findOne({ _id: aluno._id }).exec()
    console.log(existingAluno)

    if(!existingAluno || existingAluno == null) {
        var newAluno = new Aluno(aluno)
        return newAluno.save()
    }
}

module.exports.update = (id, aluno) => {
    return Aluno
        .findByIdAndUpdate(id, aluno)
        .exec()
}

module.exports.delete = (id) => {
    return Aluno
        .findByIdAndDelete(id)
        .exec()
}

module.exports.inverteTpc = async (id, idTpc) => {
    var aluno = await Aluno
        .findOne({_id : id})
        .exec()
        
    var tpc = `tpc${idTpc}`
    if(aluno[tpc]) {
        aluno[tpc] = !aluno[tpc]
    } else {
        aluno[tpc] = true
    }
    return Aluno
        .findByIdAndUpdate(id, aluno)
        .exec()
}