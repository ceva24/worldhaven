import type { EnhanceableAbilityCard, Enhancement } from "types";
import { readdirSync } from "node:fs";
import Jimp from "jimp";
import enhancementData from "./data/enhancements/enhancements.json";
import data from "./data/enhancements/ability-cards/br.json";

const enhancements: Enhancement[] = enhancementData;

const files = readdirSync('./images/character-ability-cards-enhanced/gloomhaven/BR/gh-trample/')

const files2 = files.slice(9750);

const main = async () => {
files2.forEach((file: string) => {
    const card: EnhanceableAbilityCard = { ...data[0] };

    card.imageUrl = 'images/character-ability-cards-enhanced/gloomhaven/BR/gh-trample/' + file;

    const possibleEnhancements = [
    "poison",
    "wound",
    "muddle",
    "immobilize",
    "disarm",
    "curse",
    "fire",
    "ice",
    "air",
    "earth",
    "light",
    "dark",
    "any-element",
    "plus-one"
    ];

    const validEnhc: Enhancement[] = enhancements.filter((enhc: Enhancement) => possibleEnhancements.includes(enhc.name));

    Promise.all(validEnhc.map(async (enhc: Enhancement) => Jimp.read(`./${enhc.imageUrl}`))).then((images: Jimp[]) => {
        
        validEnhc.forEach((enhc: Enhancement, index: number) => {    
            Jimp.read(`./${card.imageUrl}`).then((cardImageData: Jimp) => {
                    const newImage = cardImageData.composite(images[index], card.enhancementSlots[0].x - 6, card.enhancementSlots[0].y - 15)
    
                    const cardBaseName = "./" + card.imageUrl
                    .substring(0, card.imageUrl.lastIndexOf("-none."))
                    .replace("character-ability-cards-enhanced", "character-ability-cards-enhanced2")
                    .concat("-").concat(enhc.name).concat(".png");
    
                    console.log(cardBaseName);
                    newImage.write(cardBaseName);
                });
            })
        })
    })
}

main()
