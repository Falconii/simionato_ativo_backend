const celularSrv = require('../service/celularesService');
const erroDB = require('./userfunctiondb');

/* REGRA DE NEGÓCIO celulares */

exports.celular_Inclusao = async function(celular) { 
    try { 
        const obj = await celularSrv.getCelular(celular.androidid);
        if (obj != null) { 
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CELULAR', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
        }
    } catch (err) { 
        throw err; 
    }

    return; 
}; 

exports.celular_Alteracao = async function(celular) { 
    try { 
        const obj = await celularSrv.getCelular(celular.androidid);
        if (obj == null) { 
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CELULAR', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) { 
        throw err; 
    }

    return; 
}; 

exports.celular_Exclusao = async function(androidid) { 
    try { 
        const obj = await celularSrv.getCelular(androidid);
        if (obj == null) { 
            throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CELULAR', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
        }
    } catch (err) { 
        throw err; 
    }

    return; 
};
