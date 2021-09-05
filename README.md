# Classless Inter-Domain Routing (CIDR) Notation Calculator

> CIDR notation is a compact representation of an IP address and its associated network mask. The notation was invented by Phil Karn in the 1980s. CIDR notation specifies an IP address, a slash ('/') character, and a decimal number. The decimal number is the count of leading 1 bits in the network mask.
>
> -- [Wikipedia](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi1-cenwurxAhXvYd8KHf_tD0kQFjAHegQIChAD&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FClassless_Inter-Domain_Routing%23%3A~%3Atext%3DCIDR%2520notation%2520is%2520a%2520compact%2Cbits%2520in%2520the%2520network%2520mask.&usg=AOvVaw2nDWDw7Awi2gjUL2lcmRkI)

## Why?

> Eventhough I am not a network guy but understandinbg these network concepts are fun. I wanted to develop a CIDR calculator app (Web, Mobile, and Desktop) and this is the start.

## Notable Stacks

* Typescript
* [Bitset](https://www.npmjs.com/package/bitset)
* Jest with ts-jest

## Install

* `npm i @simplyappdevs/cidr-calculator`

## Manual Build

* Clone repo: `git clone https://github.com/simplyappdevs/cidr-calculator.git`
* CWD: `cd cidr-calculator`
* Install deps: `npm i`
* Clear existing output: `npm run clean`
* Build module: `npm run build`
* Test: `npm test`

## Example

> Examples on how to use this module is available from [https://github.com/simplyappdevs/cidr-calculator-example](https://github.com/simplyappdevs/cidr-calculator-example)

## Reminder for ESM Application

### npm exec command option

> You will need to run your application with `--es-module-specifier-resolution=node` option.
>
> Ex: `"exec": "node --es-module-specifier-resolution=node ./dist/index.js"` for your NPM script `npm run exec`.

### Configure package.json

> Set type to module `"type": "module"`

```json
{
  "name": "nodejs-prompt-example",
  "version": "1.0.0",
  "description": "My Awesome App",
  "main": "index.js",
  "type": "module",
  "scripts": {
  }
}
```

### Configure tsconfig.json

> Set module to one of ECMA script `"module": "esnext"` in `compilerOptions` section

```json
{
  "compilerOptions": {
    "module": "esnext",
  }
}
```

> Set module resolution to node `"moduleResolution": "node"` in `compilerOptions` section

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
  }
}
```

Brought to you by www.simplyappdevs.com (2021)
