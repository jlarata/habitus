export class Ingredientes {
    amount?: number;
    extendedName?: string;
    image?: string;
    original?: string;
    name?:string;
}

export class Receta {
    id?: number;
    image?: string;
    imageType?: string;
    title?: string;
    missedIngredientCount?: number;
    missedIngredients?: Ingredientes[]
    extendedIngredients?: Ingredientes[]
}

export class Step {
    number?:number;
    step?: string;
}

export class QueryDeRecetaForDisplay {
    name? : string;
    ingredientes?: Ingredientes[]; 
    steps?: Step[]
}


export class QueryDeRecetas {
    number?: number;
    offset?: number;
    results?: Receta[];
    totalResults?: number;
}
