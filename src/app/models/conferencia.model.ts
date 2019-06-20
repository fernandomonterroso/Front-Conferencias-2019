export class Conferencia{
    constructor(
        public _id: String,
        public nombreCharla:String,
        public descripcion: String,
        public comunicador: String,
        public salon: String,
        public numeroAsiento:Number,
        public fecha:Date,
        public capacidad: Number,
        public ocupados: string
    ){}
}