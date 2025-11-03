import axios, { AxiosError } from "axios";
import { decode, encode } from "blurhash";
import { createCanvas, Image } from "canvas";
import sharp from "sharp";

Bun.serve({
  port: 3000,
  routes: {
    "/v1/get_blur": {
      OPTIONS: preflight,
      POST: async (req) => {
        let data = (await req.json()) as {
          data: any;
        };

        if (data.data.startsWith("http")) {
          try {
            const resp = await axios.get(data.data, {
              responseType: "arraybuffer",
            });

            data.data = resp.data;
          } catch (err) {
            const error = err as AxiosError;
            console.error(error.message);
          }
        } else {
          data.data = atob(data.data);
        }

        const buffer = new Uint8Array(data.data.length);

        for (let x = 0; x < data.data.length; x++) {
          buffer[x] = data.data.charCodeAt(x);
        }

        const convertedImage = await sharp(buffer)
          .jpeg({ force: true, quality: 50 })
          .toBuffer();
        const image = await loadImage(convertedImage);
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
        const url = new URL(req.url);
        const hash = decodeURIComponent(url.searchParams.get("hash") ?? "");
        const format = url.searchParams.get("format") ?? "webp";
        const width = Number(url.searchParams.get("width") ?? "128");
        const height = Number(url.searchParams.get("height") ?? "128");

        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");
        const imageData = context.createImageData(width, height);
        const blurImg = decode(hash!, width, height);

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
