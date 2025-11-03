import { decode, encode } from "blurhash";
import { createCanvas, Image } from "canvas";
import sharp from "sharp";

Bun.serve({
  port: 3000,
  routes: {
    "/v1/get_blur": {
      OPTIONS: preflight,
      POST: async (req) => {
        const data = (await req.json()) as {
          data: string;
        };
        const image = await loadImage(data);
        const imageData = getImageData(image as any);

        return Response.json(
          {
            data: encode(
              imageData.data,
              imageData.width,
              imageData.height,
              4,
              3
            ),
          },
          { status: 200 }
        );
      },
    },
    "/v1/get_image": {
      OPTIONS: preflight,
      GET: async (req) => {
        const WIDTH = 190;
        const HEIGHT = 140;

        const url = new URL(req.url);
        const hash = decodeURIComponent(url.searchParams.get("hash") ?? "");
        const format = url.searchParams.get("format") ?? "webp";

        const canvas = createCanvas(WIDTH, HEIGHT);
        const context = canvas.getContext("2d");
        const imageData = context.createImageData(WIDTH, HEIGHT);
        const blurImg = decode(hash!, WIDTH, HEIGHT);

        imageData.data.set(blurImg);
        context.putImageData(imageData, 0, 0);

        let imgEdit = sharp(canvas.toBuffer());

        switch (format) {
          case "png": {
            imgEdit = imgEdit.png({
              compressionLevel: 9,
              quality: 20,
              effort: 10,
            });
            break;
          }
          case "jpeg": {
            imgEdit = imgEdit.jpeg({
              quality: 20,
              optimiseCoding: true,
            });
            break;
          }
          case "webp": {
            imgEdit = imgEdit.webp({
              effort: 1,
              lossless: false,
              alphaQuality: 0,
              quality: 20,
            });
            break;
          }
          case "avif": {
            imgEdit = imgEdit.avif({
              effort: 1,
              lossless: false,
              quality: 20,
            });
            break;
          }
        }

        return new Response(await imgEdit.toBuffer(), {
          status: 200,
          headers: {
            "Content-Disposition": "inline",
            "Content-Type": "image/" + format,
          },
        });
      },
    },
  },
});

function preflight() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

console.log("Server running on :3000");

const loadImage = async (src: any) =>
  new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);

    img.src = src;
  });

const getImageData = (image: Image) => {
  const canvas = createCanvas(0, 0);
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, image.width, image.height);
};
