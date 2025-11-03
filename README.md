# FamilyBlur

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [License](#license)

## About <a name = "about"></a>

FamilyBlur is a small REST-API Server written in BunJS to create an BlurHash from an image.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

- A Computer
- BunJS

### Installing

Clone this Repository to your local maschine

then run:

```bash
bun install
```

and done!

## Deployment <a name = "Deployment"></a>

To deploy a docker container use the offical package: `ghcr.io/chaos-familie/familyblur`.

**Docker Run**

```bash
docker run -p 3000:3000 ghcr.io/chaos-familie/familyblur
```

**Docker Compose**

```yaml
services:
  familyblur:
    image: ghcr.io/chaos-familie/familyblur
    ports:
      - 3000:3000
```

## Usage <a name = "usage"></a>

Start the development server with `bun dev` - the Server runs on the port `3000`

**POST:** `/v1/get_blur` - Generates an BlurHash from an image.

**Request**

```json
{
  "data": "<base64 encoded image>"
}
```

**Response**

```json
{
  "data": "<blurhash>"
}
```

---

**GET:** `/v1/get_image` - Get's an blurred image from an blurhash

**Query**

```
? hash=<blurhash> & format=<png | jpeg | webp | avif>
```

> **hash** should be URI encoded (for example with `encodeURIComponent`)
>
> **format** is optional, default is `png`

**Response**

an Attached image

## License

This project is distributed and licensed under the [**GPL-3.0**](./LICENSE) license.

© 2025 [Chaos Familie](https://github.com/Chaos-Familie)
