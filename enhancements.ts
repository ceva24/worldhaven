import type { EnhanceableAbilityCard, EnhancementType, EnhancementAction, Enhancement, AbilityCardEnhancementSlot } from "types";
import { unlinkSync } from "node:fs";
import Jimp from "jimp";
import { CWebp } from "cwebp";
import enhancementTypesData from "./data/enhancements/enhancement-types.json";
import enhancementActionsData from "./data/enhancements/enhancement-actions.json";
import enhancementData from "./data/enhancements/enhancements.json";
import swData from "./data/enhancements/ability-cards/sw.json";

const enhancementTypes: EnhancementType[] = enhancementTypesData;
const enhancementActions: EnhancementAction[] = enhancementActionsData;
const enhancements: Enhancement[] = enhancementData;

const swCards: EnhanceableAbilityCard[] = swData;

interface ChosenEnhancement {
    slot: AbilityCardEnhancementSlot;
    enhancement: Enhancement;
}

const createCardWithEnhancements = (card: EnhanceableAbilityCard, chosenEnhancements: ChosenEnhancement[]): void => {
    const chosenSlotIds = chosenEnhancements.map((chosenEnhancement: ChosenEnhancement) => chosenEnhancement.slot.id)
    const outstandingSlots = card.enhancementSlots.filter((slot: AbilityCardEnhancementSlot) => !chosenSlotIds.includes(slot.id));

    const nextSlot = outstandingSlots.shift();

    if (nextSlot) {
        getPossibleEnhancementsForSlot(nextSlot).forEach((enhancement: Enhancement)=> {
            const chosenEnhc: ChosenEnhancement = {
                slot: nextSlot,
                enhancement: enhancement
            };

            createCardWithEnhancements(card, chosenEnhancements.concat(chosenEnhc));
        });
    }
    else {
        generateFinalImage(card, chosenEnhancements);
    }
}

const getPossibleEnhancementsForSlot = (slot: AbilityCardEnhancementSlot): Enhancement[] => {
    const action = enhancementActions.find((action: EnhancementAction) => action.name === slot.action);
    if (!action) throw new Error("Failed to find enhancement action type for string " + slot.action);

    const types = enhancementTypes
    .filter((type: EnhancementType) => action.type.includes(type.name))
    .flatMap((type: EnhancementType) => type.enhancements);

    const possibleEnhancements = enhancements.filter((enhc: Enhancement) => types.includes(enhc.name));

    return Array.from(new Set(possibleEnhancements));
}

const generateFinalImage = async (card: EnhanceableAbilityCard, enhancements: ChosenEnhancement[]) => {
    const cardImage = await Jimp.read(`./${card.imageUrl}`);

    const validEnhancements: ChosenEnhancement[] = enhancements.filter((enhc: ChosenEnhancement) => enhc.enhancement.imageUrl);

    const images: Jimp[] = await Promise.all(validEnhancements.map(async (enhc: ChosenEnhancement) => Jimp.read(`./${enhc.enhancement.imageUrl}`)));

    const finalImage = images.reduce((previous: Jimp, current: Jimp, index: number) => (
        previous.composite(current, validEnhancements[index].slot.x - 6, validEnhancements[index].slot.y - 15)
    ), cardImage);

    const imageName = generateImageName(card, enhancements);

    console.log(`Writing images for ${imageName}`);

    finalImage.write(`./${imageName}.png`, async () => {
        createJpgImage(finalImage, imageName);
        await createWebpImage(imageName);
        unlinkSync(`./${imageName}.png`);
    });
}

const generateImageName = (card: EnhanceableAbilityCard, enhancements: ChosenEnhancement[]) => {
    const enhancementNames = enhancements.map((chosenEnhancement: ChosenEnhancement) => chosenEnhancement.enhancement.name)

    const cardBaseName = card.imageUrl
    .substring(0, card.imageUrl.lastIndexOf("."))
    .replace("character-ability-cards", "character-ability-cards-enhanced")
    .concat("/");

    const cardName = enhancementNames.reduce((previous: string, current: string) => { return `${previous}${current}-` }, cardBaseName);

    return cardName.slice(0, -1);
}

const createJpgImage = (imageData: Jimp, imagePath: string) => {
    imageData.resize(300, 400).quality(65).write(`./${imagePath}.jpg`);
}

const createWebpImage = async (imagePath: string) => {
    const encoder = new CWebp(`./${imagePath}.png`);
    encoder.resize(300, 400);

    await encoder.write(`./${imagePath}.webp`);
}

createCardWithEnhancements(swCards[25], []);
