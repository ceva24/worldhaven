import { readdirSync, statSync, unlinkSync } from "node:fs";
import Jimp from "jimp";

const convertPngsToMidQualityJpgs = () => {
    convertImagesInDirectory("./images/character-mats/gloomhaven", 600, 400);
    convertImagesInDirectory("./images/personal-quests/gloomhaven", 300, 400);
    convertImagesInDirectory("./images/items/gloomhaven/1-14/", 200, 296);
}

const convertImagesInDirectory = (directory: string, targetWidth: number, targetHeight: number) => {
    console.info(`Recursing through directory '${directory}'`);

    const fileNames: string[] = readdirSync(directory);

    fileNames.forEach((fileName: string) => {
        const absoluteFilePath = `${directory}/${fileName}`;

        if (statSync(absoluteFilePath).isDirectory()) {
            convertImagesInDirectory(absoluteFilePath, targetWidth, targetHeight);
        }
        else if (fileName.endsWith(".png")) {
            convertImage(absoluteFilePath, targetWidth, targetHeight);
        }
        else {
            console.info(`Ignoring file '${fileName}'`);
        }
    })
}

const convertImage = async (imagePath: string, targetWidth: number, targetHeight: number) => {
    console.info(`Converting file '${imagePath}'...`);

    const jpgImagePath = await writeJpg(imagePath, targetWidth, targetHeight);

    console.info(`...successfully written to '${jpgImagePath}'`);
}

const writeJpg = async (imagePath: string, targetWidth: number, targetHeight: number): Promise<string> => {
    const newImagePath = `${imagePath.substring(0, imagePath.lastIndexOf("."))}.jpg`;

    const image = await Jimp.read(imagePath);

    image.resize(targetWidth, targetHeight).quality(65).write(newImagePath);

    return newImagePath;
}

convertPngsToMidQualityJpgs();