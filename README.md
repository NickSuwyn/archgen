# ArchGen - A code generation tool to reduce boiler plate coding.

## Install

```sh
$ npm install -g archgen
```

## Usage

Create an empty directory that will serve as the root of your project and then create descriptor.json. In the descriptor.json file create the project descriptor json object. Each archetype should contain a README.md that defines the variables required to generate a project from that archetype. The layout for the descriptor is as follows:

```JSON
{
  "[anyVariablesDefinedInArchtypeREADME]": "value",
  "entities": [
    {
      "name": "entityName",
      "[anyEntityVariablesDefinedInArchtypeREADME]": "value",
      "props": [
        {
          "type": "propertyType",
          "name": "propertyName",
          "[anyPropertyVariablesDefinedInArchtypeREADME]": "value"
        }
      ]
    }
  ]
}
```

After completing your project descriptor, run the following command to generate your project:

```sh
$ archgen [archetype]
```
