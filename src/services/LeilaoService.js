import BaseService from "./BaseService"

class LeilaoService extends BaseService {

    constructor() {
        super("/leilao")
    }

    async findAll() {
        const resposta = await this.api.get(`${this.endPoint}`)
        return resposta;
    }

    async findByCategory(id) {
        const resposta = await this.api.get(`${this.endPoint}/category/${id}`)
        return resposta;
    }

    async findById(id) {
        const resposta = await this.api.get(`${this.endPoint}/${id}`)
        return resposta;
    }

    async update(dados) {
        const resposta = await this.api.put(`${this.endPoint}`, dados)
        return resposta;
    }

    async delete(id){
        const resposta = await this.api.delete(`${this.endPoint}/${id}`)
        return resposta;
    }

    async create(leilao){
        const resposta = await this.api.post(`${this.endPoint}`, leilao)
        return resposta;
    }

}

export default LeilaoService