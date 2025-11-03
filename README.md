# FamilyBlur

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

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

## Usage <a name = "usage"></a>

Start the development server with `bun dev` - the Server runs on the port `3000`

**POST:** `/v1/get_blur` - Generates an BlurHash from an image.

**Request**

```
{
    "data": "<base64 encoded image>"
}
```

**Response**

```
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

**Response**

an Attached image
