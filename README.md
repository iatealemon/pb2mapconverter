# PB2 to PB3 Map Converter

This repository hosts a simple web application that converts a given PB2 .xml file into PB3 source code. User can then copy the source code into a creation's file content. Feel free to contribute!

Link to web application.

## Architecture

#### Prerequisites

- Node v24.12.0 (there's a .nvmrc file)

> [!NOTE]
> If you are only interested at the logic that handles the conversion of PB2 XML map to PB3 source code, the entry point is in src/process.ts.

It's a simple Express JS typescript web application, with vanilla HTML, CSS and JS.

`npm init` **first** to download dependencies.

then

- `npm run dev` to run web application in development mode
- `npm run test` to run test runner for quick testing with the parsing functionality. (use this so that you don't have to drop the file everytime to test lol)

you can see the scripts in `package.json` for other commands but these are the main 2 for most people.

## Implementation details

### Overview

1. Parse the PB2 .xml file into typed PB2 objects (like PB2Wall, PB2Background, etc..). This results in PB2Map, a typed representation of the pb2 map.
2. Do some processing with PB2Map to support PB3
    1. Creating of PB3 specific objects like Assets.
    2. Handling triggers, etc..
3. Serialize the processed PB2Map into a valid representation of PB3 source code.
    1. The corresponding PB3 source code follows this specific format
       `{ *some javascript code* }//->Ditto->//{ *some JSON for editor* }`
    2. We map each PB2/3 object into the corresponding javascript code and JSON editor object.
    3. We concantenate these object into one string along with an appropriate default header and footer.

### Caveats

- Most of the spacing in the resulting serialized source code matters. Here's an example.

```js
pb2GameWorld.CreateBoxShape({ x: 0, y: 0, w: 10, h: 10, type: pb2Shape.WALL }); //->Ditto->//{"operation":"create","constructor":"pb2GameWorld.CreateBoxShape","x":"0","y":"0","w":"10","h":"10","m":"null","wc":"null","type":"pb2Shape.WALL","corner":"pb2Shape.CORNER_NONE","dots":"null","_points_being_edited":false,"_visible":"1","_locked":"0","_disabled":"0","id":""}
```

No spacing between Ditto, code and JSON.. spacing in the javascript code.. etc..

- Property numbers in JSON editor object should actually be stored as a string. For an example,

```
    const editor_object = {
        /* .... */
        // must be string! the resulting source code must have the value wrapped in quotation marks.
        x: pb2Wall.geometry.x.toString(),
        y: pb2Wall.geometry.y.toString(),
        w: pb2Wall.geometry.w.toString(),
        h: pb2Wall.geometry.h.toString(),
        /* .... */
    };
```
