import { readdirSync, statSync } from "node:fs";
import { CWebp } from "cwebp"; 
import Jimp from "jimp";

const createWebQualityImages = async () => {
    createImagesForDirectory("./images/character-icons/gloomhaven", 200, 200);
    createImagesForDirectory("./images/character-mats/gloomhaven", 600, 400);
    createImagesForDirectory("./images/personal-quests/gloomhaven", 300, 400);
    createImagesForDirectory("./images/items/gloomhaven/1-14", 200, 296);
    createImagesForDirectory("./images/character-ability-cards/gloomhaven", 300, 400);
    createImagesForDirectory("./images/attack-modifiers/gloomhaven/base/player", 300, 200);
}

const createImagesForDirectory = (directory: string, targetWidth: number, targetHeight: number) => {
    console.info(`Recursing through directory '${directory}'`);

    const fileNames: string[] = readdirSync(directory);

    fileNames.forEach((fileName: string) => {
        const absoluteFilePath = `${directory}/${fileName}`;

        if (statSync(absoluteFilePath).isDirectory()) {
            createImagesForDirectory(absoluteFilePath, targetWidth, targetHeight);
        }
        else if (fileName.endsWith(".png")) {
            createImages(absoluteFilePath, targetWidth, targetHeight);
        }
        else {
            console.info(`Ignoring file '${fileName}'`);
        }
    })
}

const createImages = async (imagePath: string, targetWidth: number, targetHeight: number) => {
    console.info(`Converting file '${imagePath}'...`);

    const webpImagePath = await writeWebp(imagePath, targetWidth, targetHeight);
    const jpgImagePath = await writeJpg(imagePath, targetWidth, targetHeight);

    console.info(`...successfully written to '${webpImagePath}' and '${jpgImagePath}'`);
}

const writeWebp = async (imagePath: string, targetWidth: number, targetHeight: number): Promise<string> => {
    const newImagePath = `${imagePath.substring(0, imagePath.lastIndexOf("."))}.webp`;

    const encoder = new CWebp(imagePath);
    
    encoder.resize(targetWidth, targetHeight);

    await encoder.write(newImagePath)

    return newImagePath;
}

const writeJpg = async (imagePath: string, targetWidth: number, targetHeight: number): Promise<string> => {
    const newImagePath = `${imagePath.substring(0, imagePath.lastIndexOf("."))}.jpg`;

    const image = await Jimp.read(imagePath);

    image.resize(targetWidth, targetHeight).quality(65).write(newImagePath);
    
    return newImagePath;
}

createWebQualityImages();
