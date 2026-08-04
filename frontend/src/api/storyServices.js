import { apiRequest } from "./client";

export async function getMyStories() {
    return apiRequest("/stories");
    
}

export async function  generateStory(idLanguage) {
    return apiRequest("/stories",{
        method: "POST",
        body: JSON.stringify({
            id_language:idLanguage
        }),
    });
}