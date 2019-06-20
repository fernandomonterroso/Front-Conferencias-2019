export class User{
    constructor(
        public _id: string,
        public carnet: String,
        public nombre: String,
        public email: String,
        public password: String,
        public rol: String,
        public productosVendidos: [{
            productTableId: String,
            nombreProducto: String,
            cantidad: Number,
            precioIndividual:Number,
            totalProducto:Number
        }],
        public totalVendido: Number,
        public image: String
    ){ }
}