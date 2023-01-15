import { readdirSync } from "node:fs";
import Jimp from "jimp";
import { CWebp } from "cwebp";

const location = '../images/character-ability-cards-enhanced/gloomhaven/BR/gh-trample/';

const convert = async () => {

    const files = readdirSync(location);

    const filesToConvert = files.slice(7000);

    for (let i = 0; i < filesToConvert.length; i++) {
        const fileLocation = location.concat(filesToConvert[i]);
        const baseFileLocation = fileLocation.substring(0, fileLocation.lastIndexOf(".")).replace("gh-trample", "gh-trample-webqual");

        console.log(baseFileLocation);

        const imageData = await Jimp.read(fileLocation);
        createJpgImage(imageData, baseFileLocation);
        await createWebpImage(fileLocation, baseFileLocation);
    }
}

const createJpgImage = async (imageData: Jimp, imagePath: string) => {
    const jpgImagePath = imagePath.concat(".jpg");

    imageData.resize(300, 400).quality(65).write(jpgImagePath);
}

const createWebpImage = async (pngPath: string, imagePath: string) => {
    const webpImagePath = imagePath.concat(".webp");

    const encoder = new CWebp(pngPath);
    encoder.resize(300, 400);

    await encoder.write(webpImagePath);
}

convert();
