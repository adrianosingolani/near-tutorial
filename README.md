# near-tutorial

Code for the "Getting started with NEAR development" tutorial.
Make sure to checkout to the video-start branch if you want to code along with the video.
This main branch has the final code produced on the video.

Below are the steps that I used to create the code on the video-start branch. You don't need to do this if you are going to clone the repository:

1) create a new directory and switch to it:
mkdir near-tutorial
cd near-tutorial

2) initialize a new project:
npm init -y

3) create asconfig.json file:
touch asconfig.json

4) in asconfig.json, add the following:
{
  "extends": "near-sdk-as/asconfig.json"
}

5) create assembly folder and the files index.ts, tsconfig.json and as_types.d.ts inside of it.
mkdir assembly
cd assembly
touch index.ts
touch tsconfig.json
touch as_types.d.ts

6) in as_types.d.ts, add the following (yes, with 3 slashes):
/// <reference types="near-sdk-as/assembly/as_types" />

7) in tsconfig.json, add the following:
{
  "extends": "../node_modules/assemblyscript/std/assembly.json",
  "include": [
    "./**/*.ts"
  ]
}