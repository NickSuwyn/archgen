# archgen - a code generation tool to reduce boiler plate coding.

## Install

```sh
$ npm install -g archgen
```

## Usage

Create an empty directory that will serve as the root of your project and then create descriptor.json in that directory. In the descriptor.json file create the project descriptor json object. This descriptor should describe the entities you wish to initialize your project with. The layout for the descriptor is as follows:

```json
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

Each archetype should contain a README.md that defines the variables required to generate a project from that archetype. Note that if you do not define all required variables for a given archetype, archgen will fail to create your project. To view the available archetypes visit [github.com/NickSuwyn/archgen/tree/master/bin/archetypes](https://github.com/NickSuwyn/archgen/tree/master/bin/archetypes). If you wish to build your own archetypes, or contribute archetypes to the repository, follow the section entitled *Custom Archetypes* below.

## Example of Usage Tutorial
In this tutorial we will use the mean-ts archetype to generate a full stack crud application that contains User, Post, and Comment entities for a social-media-like app.

- Create new directory for your project.

![Creat New Directory](assets/createNewDirectory.png)
- Inside the new directory, create the file descriptor.json.

![Descriptor.json](assets/descriptor.png)
- Choose the archetype you want to use (we will use mean-ts for this tutorial) and write a JSON descriptor that implements the variables for that archetype.

```json
{
  "name": "ExampleUsageTutorial",
  "connection": "enter your mongo connection string here",
  "entities": [
    {
      "name": "user",
      "props": [
        {
          "name": "userName",
          "type": "string"
        },
        {
          "name": "password",
          "type": "string"
        },
        {
          "name": "userId",
          "type": "string"
        }
      ]
    },
    {
      "name": "post",
      "props": [
        {
          "name": "postId",
          "type": "string"
        },
        {
          "name": "userId",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        },
        {
          "name": "dateCreated",
          "type": "string"
        }
      ]
    },
    {
      "name": "comment",
      "props": [
        {
          "name": "commentId",
          "type": "string"
        },
        {
          "name": "userId",
          "type": "string"
        },
        {
          "name": "postId",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        },
        {
          "name": "dateCreated",
          "type": "string"
        }
      ]
    }
  ]
}

```

- Run the following command (again, we are using mean-ts, you would simply substitute that for any other archetype you wish to use):

```sh
$ archgen mean-ts
```

- Your console will output the files it is writing and you should see something similar to the following:

![Output](assets/output.png)

- You should now have all the files generated for your project.

![Files Generated](assets/filesGenerated.png)

- For the mean-ts archetype we now need to run ```npm install```, ```bower install```, and ```tsc``` per the mean-ts README.md instructions. After running these commands we should be able to run ```npm start``` to run the project.

## Custom Archetypes
If you want to create your own archetype, either for personal use or to add it to the repository for everyone to benefit, just follow the below documentation.
### Archetype Files and Structure
Each archetype is simply a folder with a bunch of .txt files defining the project template. While all the files are .txt files, they are not all the same. There are two types of template files - Entity files and Static files.
- Entity files are templates that define a file that will be created for each entity defined in the projects descriptor.json file.
- Static files are only created once in a project; these files are generally things such as an index.html or config file, where multiple copies don't really make sense. Note that static file templates can still have template variables in them, so the text is not truly *static* in the traditional sense, the quantity of output files from that template file is simply static in that it is always one.

## Future Plans
Currently all the archetypes are stored on GitHub with this package. The problem this presents is that any time new archetypes are created a new release of the package has to be published to npm in order for users to have access to the new archetypes without manually downloading and placing them into their npm folder. In the near future I will either find a better way to store archetypes or create an archetype repository app myself. Either way, I will build an *add* command that will install new archetypes by name so that I don't have to do a new release for each new archetype, and so that users can simply install the additional archetypes they want.
