import { readFileSync } from "fs";
import startCase from "lodash.startcase";

interface ItemData {
    name: string;
    points: number;
    expansion: string;
    image: string;
    xws: string;
}

interface Item {
    id: number;
    name: string;
    imageUrl: string;
    slot: string;
    slotImageUrl: string;
    group: string;
    alternativeImageUrl: string;
}

const data = readFileSync("./data/items.js");
const itemData: ItemData[] = JSON.parse(data.toString()) as ItemData[]

const createItemEntries = () => {
    const entries = createItemEntriesForLevel("64-151", "9");

    console.log(JSON.stringify(entries, null, 4));
}

const createItemEntriesForLevel = (level: string, group: string): Item[] => {
    const gameItems = itemData.filter((item: ItemData) => {
        return item.expansion === "Gloomhaven" && !item.name.startsWith("item") && item.image.match(level) && !item.image.match("-back.png")
    });

    const items: Item[] = gameItems.map((item: ItemData) => {
        return {
            id: 50,
            name: startCase(item.name),
            imageUrl: item.image.replace(".png", ".webp"),
            slot: "Head",
            slotImageUrl: "/equip-slot-icons/gloomhaven/head.webp",
            group,
            alternativeImageUrl: "",
        }
    });

    return items;
}

createItemEntries();
