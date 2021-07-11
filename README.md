# pack-to-folder
Runs `npm pack` command and then extracts archive to folder

## Requirements
`node >= 12`

## Installation
`npm i pack-to-folder`

or 

`yarn add pack-to-folder`

## Usage
`npx pack-to-folder [--renameTo=package]`

Options:
  - `--renameTo=package` (optional) - renames `package` folder, can be relative or absolute path
  - `--forceRewrite` (optional) - if target folder already exists, delete it before unpacking
