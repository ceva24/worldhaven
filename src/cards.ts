import { readFileSync } from "node:fs";
import { titleCase } from "title-case";

interface AbilityCardData {
    name: string;
    points: number;
    expansion: string;
    image: string;
    xws: string;
    level: string;
    initiative: string;
    cardno: string;
}

interface AbilityCardEntry {
    id: number;
    name: string;
    level: string;
    imageUrl: string;
}

const data = readFileSync("./data/character-ability-cards.js");
const abilityCardData: AbilityCardData[] = JSON.parse(data.toString()) as AbilityCardData[]

const createAbilityCardEntries = () => {
    const entries = createAbilityCardEntriesForClass("CH");

    console.log(JSON.stringify(entries, null, 4));
}

const createAbilityCardEntriesForClass = (classAbbreviation: string): AbilityCardEntry[] => {
    const characterCards = abilityCardData.filter((abilityCardData: AbilityCardData) => {
        return abilityCardData.expansion === "Gloomhaven" && abilityCardData.image.startsWith(`character-ability-cards/gloomhaven/${classAbbreviation}/`)
    });

    const abilityCardEntries: AbilityCardEntry[] = characterCards.map((abilityCardData: AbilityCardData) => {
        return {
            id: parseInt(abilityCardData.cardno),
            name: titleCase(abilityCardData.name),
            level: abilityCardData.level,
            imageUrl: `/${abilityCardData.image.replace(".png", ".webp")}`
        }
    });

    const sortedEntries = abilityCardEntries.slice().sort((a: AbilityCardEntry, b: AbilityCardEntry) => a.id > b.id ? 1 : -1 );

    return sortedEntries;
}

createAbilityCardEntries();
