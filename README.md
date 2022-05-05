Getting started with NEAR smart contract development
====================================================

### Description
Code of the "Getting started with NEAR smart contract development" tutorial.

This is the right branch if you want to code along with the video.

The main branch has the final code produced on the video.

### Creating the boilerplate
Below are the steps that I used to create the code on the video-start branch. You don't need to do this if you are going to clone the repository.

**Create a new directory and switch to it:**
```
mkdir near-tutorial && cd near-tutorial
```

**Initialize a new project:**
```
npm init -y
```

**Create *`asconfig.json`* file:**
```
touch asconfig.json
```

**In *`asconfig.json`*, add the following:**
```javascript
{
  "extends": "near-sdk-as/asconfig.json"
}
```

**Create *`assembly`* folder and the files *`index.ts`*, *`tsconfig.json`* and *`as_types.d.ts`* inside of it:**
```
mkdir assembly && cd assembly && touch index.ts tsconfig.json as_types.d.ts
```

**In *`as_types.d.ts`*, add the following (yes, with 3 slashes):**
```javascript
/// <reference types="near-sdk-as/assembly/as_types" />
```

**In *`tsconfig.json`*, add the following:**
```javascript
{
  "extends": "../node_modules/assemblyscript/std/assembly.json",
  "include": [
    "./**/*.ts"
  ]
}
```