const sharp = require("sharp");
const path = require("path");

const inputPath = process.argv[2];
const outputPath =
  process.argv[3] ||
  path.join(__dirname, "..", "frontend", "public", "CooksyLogo.png");

if (!inputPath) {
  console.error("Usage: node circle-crop-logo.cjs <input.png> [output.png]");
  process.exit(1);
}

async function circleCrop() {
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  const size = Math.min(width, height);

  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>`
  );

  await image
    .resize(size, size)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toFile(outputPath);

  console.log("Circle-cropped logo saved to:", outputPath);
}

circleCrop().catch((err) => {
  console.error(err);
  process.exit(1);
});
