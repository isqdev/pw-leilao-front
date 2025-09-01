import BaseService from "./BaseService"

class LeilaoService extends BaseService {

    constructor() {
        super("/leilao")
    }

    async findAll() {
        const resposta = await this.api.get(`${this.endPoint}`)
        return resposta;
    }

}

export default LeilaoService