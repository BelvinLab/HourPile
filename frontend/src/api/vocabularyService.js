import { apiRequest } from "./client";

export async function create_vocabulary({idLanguage,word,translation,definition,example,category}){
    return apiRequest("/vocabulary/create",{
        method : "POST",
        body: JSON.stringify({
            id_language: Number(idLanguage),
            word:word,
            translation:translation,
            definition:definition,
            example:example,
            category:category,

        }),

    });
}

export async function getMyVocabulary() {
    return apiRequest("/vocabulary/my_vocabulary")
}