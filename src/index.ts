import { assertTruthy, filterNoUndefinedNoNull } from "@nvon/baseline";
import { join } from "path";
import sharp from "sharp";
import { globby } from "globby";
import { getPath } from "./paths.js";

type ColorChannel = "red" | "blue" | "green";

// const outFiles = ["red", "blue", "green"].map((color) => {
//   return sf
//     .extractChannel(color)
//     .toFile(join(getPath().OUT_DIR, `${color}.png`));
// });

// const another = sf.extractChannel("red").toFile("");

const aoFile = join(
  getPath().INPUT_FILES_DIR,
  "TexturesCom_Wall_CobblestoneMixed1_5x2.5_512_ao.tif"
);
const roughnessFile = join(
  getPath().INPUT_FILES_DIR,
  "TexturesCom_Wall_CobblestoneMixed1_5x2.5_512_roughness.tif"
);

const out = join(getPath().OUT_DIR, "combined.png");

const newFile = await sharp(aoFile).joinChannel(roughnessFile).toFile(out);

const channelData: {
  fileGlob: string;
  color: ColorChannel;
}[] = [
  {
    fileGlob: "*_ao.*",
    color: "red",
  },
  {
    fileGlob: "*_metallness.*",
    color: "blue",
  },
  {
    fileGlob: "*_roughness.*",
    color: "green",
  },
];

const channelBuffers = (
  await Promise.all(
    channelData.map(async (channel) => {
      const files = await globby(channel.fileGlob, {
        cwd: getPath().INPUT_FILES_DIR,
      });

      assertTruthy(
        files.length < 2,
        `Found multiple files for glob: ${channel.fileGlob}`
      );

      if (!files[0]) {
        return;
      }

      const file = join(getPath().INPUT_FILES_DIR, files[0]);

      await sharp(file, {}).extractChannel(channel.color);

      return {
        channel: channel.color,
        buffer,
      };
    })
  )
).filter(filterNoUndefinedNoNull);

// groundMat.useAmbientOcclusionFromMetallicTextureRed = true;
// groundMat.useMetallnessFromMetallicTextureBlue = true;
// groundMat.useRoughnessFromMetallicTextureGreen = true;
