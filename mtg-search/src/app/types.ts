interface Card {
    name: string;
    mana_cost: string;
    colors: string[];
    type_line: string;
    oracle_text: string;
    activeFace: any;
    image_uris: {
        small: string;
        normal: string;
        large: string;
        png: string;
        art_crop: string;
    };
    card_faces: {
        mana_cost: string;
        type_line: string;
        oracle_text: string;
        image_uris: {
            small: string;
            normal: string;
            large: string;
            png: string;
            art_crop: string;
        };
    }[];
}

interface SearchResponse {
    cards: Card[];
    totalPages: number;
}

export { Card, SearchResponse };