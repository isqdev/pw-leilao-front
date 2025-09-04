import BaseService from "./BaseService"

class CategoriaService extends BaseService {

    constructor() {
        super("/categoria")
    }

    async findAll() {
        const resposta = await this.api.get(`${this.endPoint}`)
        return resposta;
    }

    async find4() {
        const resposta = await this.api.get(`${this.endPoint}/only4`)
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

    async create(categoria){
        const resposta = await this.api.post(`${this.endPoint}`, categoria)
        return resposta;
    }

}

export default CategoriaService