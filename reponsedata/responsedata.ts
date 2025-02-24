export class ResponseData<D>{
    data : D | D[] | {msg: string,  access_token: string}
    HttpCode: number
    HttpMessage: string
    constructor(data : D | D[] | {msg: string,  access_token: string} , HttpCode: number, HttpMessage: string){
        this.data = data,
        this.HttpCode = HttpCode,
        this.HttpMessage = HttpMessage
        return this
    }
}