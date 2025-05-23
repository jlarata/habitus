export class Ingredientes {
    amount?: number;
    extendedName?: string;
    image?: string;
    original?: string;
}

export class Receta {
    id?: number;
    image?: string;
    imageType?: string;
    title?: string;
    missedIngredientCount?: number;
    missedIngredients?: Ingredientes[]
}

export class QueryDeRecetas {
    number?: number;
    offset?: number;
    results?: Receta[];
    totalResults?: number;
}