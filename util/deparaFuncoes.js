const deparaSrv = require ("../service/deparaService");

exports.testeChangeInventario(id_empresa,id_local){

    var params = {
        id_empresa : id_empresa,
        id_local: id_local,
        id_iventario: id_inventario,
        status: 1
    }

    try {
        //status 1
        const _status1 = await deparaSrv.processarDePara(params);

        //status 2
        params.status = 2;
        const _status2 = await deparaSrv.processarDePara(params);

        //status 3
        params.status = 3;
        const status3 =  await deparaSrv.processarDePara(params);

        const params2 = {
            id_empresa : id_empresa,
            id_local: id_local,
            id_iventario: id_inventario,
            status: 3,
            de : 0,
            para: 0
        }

        lsLista = await deparaSrv.getDeparas(params2);

        if (lsLista != null){

            for (const lista of lsLista) {
                await deparaSrv.getDeparas(params2)
              }


        }

    } catch( error){
        throw error;
    }
}