# archgen - a code generation tool to reduce boiler plate coding.

##### Table of Contents  
[Install](#install)   
[Usage](#usage)  
[Usage Tutorial](#usagetutorial)  
[Custom Archetypes](#customarchetypes)  
[Future Plans](#futureplans)  
[Bugs](#bugs)

<a name="install"/>

## Install

```sh
$ npm install -g archgen
```

<a name="usage"/>
## Usage

Create an empty directory that will serve as the root of your project and then create descriptor.json in that directory. In the descriptor.json file create the project descriptor JSON object. This descriptor should describe the entities you wish to initialize your project with. The layout for the descriptor is as follows:

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

<a name="usagetutorial"/>
## Example of Usage Tutorial
In this tutorial, we will use the mean-ts archetype to generate a full stack crud application that contains User, Post, and Comment entities for a social-media-like app.

- Create new directory for your project.

![Create New Directory](./assets/createNewDirectory.png)
- Inside the new directory, create the file descriptor.json.

![Descriptor.json](./assets/descriptor.png)
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

![Output](./assets/output.png)

- You should now have all the files generated for your project.

![Files Generated](./assets/filesGenerated.png)

- For the mean-ts archetype we now need to run ```npm install```, ```bower install```, and ```tsc``` per the mean-ts README.md instructions. After running these commands we should be able to run ```npm start``` to run the project.

<a name="customarchetypes"/>
## Custom Archetypes
If you want to create your own archetype, either for personal use or to add it to the repository for everyone to benefit, just follow the below documentation.
### Archetype Files and Structure
Each archetype is simply a folder with a bunch of .txt files defining the project template. While all the files are .txt files, they are not all the same. There are two types of template files - Entity files and Static files.
- Entity files are templates that define a file that will be created for each entity defined in the project's descriptor.json file.
- Static files are only created once in a project; these files are generally things such as an index.html or config file, where multiple copies don't really make sense. Note that static file templates can still have template variables in them, so the text is not truly *static* in the traditional sense, the quantity of output files from that template file is simply static in that it is always one.

Below is an image showing the contents of the mean-ts archetype:

![mean-ts Contents](./assets/meantsContents.png)

Notice how they are all just .txt files, except for the README.md, which **every archetype should have**.

Here is an example of a static template file:

![Static Template File](./assets/staticExample.png)
This file will only be created once in a project generated from the mean-ts archetype, but its content will differ from project to project based on the descriptor.json ran against the archetype. The first line of this template file is the address this file will be created at relative to the project root directory. We will go into further detail on template syntax rules a little further down.

Below is an example of an entity template file:

![Entity Template File](./assets/entityExample.png)
This file will be generated for each entity described in the descriptor.json file. Note that you can tell the difference between and entity file and a static file by the first line of the file. Entity files will contain ```<_forEntity_>``` as the first line and the file address as the second line, while static files have the file address as the first line.

### Different Variable Levels
Archgen has three different tiers of variables that can be used in an archetype, and each has a different level of scope. The three variable tiers, starting from the widest scope, are:
- Project Level Variables: can be used anywhere.
- Entity Level Variables: can be used in entity template files or within entity loops in static and entity template files.
- and Property Level Variables: can only be used in prop loops inside of an entity template file.

### Templating Syntax
Archgen uses a unique xml-like syntax for defining template variables and constructs. Rather than just opening and closing elements with ```<``` and ```>```, archgen uses ```<_``` and ```_>``` to avoid conflicting with HTML and other XML configuration files.

Below is a list of examples of how to use different archgen templating constructs.
- To insert a project level variable use ```<_variableName_>```
- To declare an entity template file place ```<_forEntity_>``` at the first line of the template file.
- To insert an entity level variable in and entity file or within an entity loop use ```<_entity.variableName_>```
- To insert a property level variable in a prop loop use ```<_prop.variableName_>```
- To create an entity loop, use ```<_forEntity_>``` on any line other than the first. Terminate the loop with ```<_endForEntity_>```. **Make sure there are no white spaces preceding the forEntity and endForEntity commands; they should be at the very beginning of the line and the only thing on the line**.
- Prop loops follow all the same rules as entity loops with the additional rule that they can only exist in an entity file. The syntax for opening and closing a prop loop is ```<_forProp_>``` and ```<_endForProp_>```.

### Methods
Archgen supports output manipulation methods that change the interpolation output of the template variables. The syntax to use these methods is as follows:

```
<_variableName:methodName_>
```

The colon tells archgen that the following name is a method. Here is a list of supported methods:

- firstCap: capitalizes the first character of the output value.
- Currently firstCap is the only method, more are coming soon!

### Building a Custom Archetype Tutorial
Documentation is great, and can always be better, but it doesn't have the same effect as seeing something implemented. This section is an example of how to build a custom archetype.

Let's say we want to build an archetype that generates a class for each entity and a file that imports all the classes and exports them as a module. To do this we would need two file templates - one static file to serve as the one file that imports all the entity classes and exports them as a module, and one entity file that generates a new file for each entity provided by the user's descriptor.json.

It is very helpful to build out a project, or a part of a project, and then use that project to create an archetype from it rather than just creating an archetype without anything to reference. However, it can work either way! Let's take a look at what the static file template might look like in a real scenario given that it has already been build out and we want to turn it into an archetype.

We might have something like this:

```javascript
//entity-module.js
module.exports = {
  User: require('./entities/user.js'),
  Post: require('./entities/post.js'),
  Comment: require('./entities/comment.js')
};
```

You can look at this file and see an obvious pattern - it imports each entity and follows a common naming convention. So, let's turn it into a template that would dynamically create the file based on the entities a user defines in his/her descriptor.json:

entitymodulejs.txt:
```
./entity-module.js
<_forEntity_>
<_entity.name:firstCap_>: require('./entities/<_entity.name_>.js'),
<_endForEntity_>
```

Notice that the first line is the address where the generated code will be stored, so this static file will be stored at the project root directory and will be named *entity-module.js*. The next line starts a loop that iterates over each entity, interpolates the entity name with the first letter capitalized, and then interpolates each entity name in the require path. If a user where to run a descriptor.json file, that contained 20 entities, against this archetype, it would create that line for each of the 20 entities.

Now let's take a look at the class file:

```javascript
//user.js
export default class User {
  constructor() {
    this.userName;
    this.password;
  }
}
```

Simple enough; with this we would just want a separate file generated for each entity that interpolates the entity name as the class name, and adds each property inside the constructor.

entityjs.txt
```
<_forEntity_>
./entities/<_entity.name_>.js
export default class <_entity.name:firstCap_> {
  constructor() {
<_forProp_>
    this.<_prop.name_>;
<_endForProp_>
  }
}
```

A few things to take note of: fist, notice that the first line is not the directory location that points to where the generated code will be output; that gets pushed to line two in entity template files. Line one uses ```<_forEntity_>``` to denote that it is an entity file. Secondly, notice that there is no terminating ```<_endForEntity_>``` to the first line. This is the only time a loop does not need a terminator; being at the first line tells archgen that the entire file simply needs to be generated for each entity the user defines in his/her descriptor.json. Finally, notice that the prop loop indicator and terminator (```<_forProp_>``` and ```<_endForProp_>```) are not indented at all. All loop constructs must exist on the line alone, without any other text, and must contain no leading white spaces.

The last step of creating the archetype would be to add a README.md that follows the structure and guidelines in the archetypes README.md file.

And that's it!

<a name="futureplans"/>
## Future Plans
Currently all the archetypes are stored on GitHub with this package. The problem this presents is that any time new archetypes are created a new release of the package has to be published to npm in order for users to have access to the new archetypes without manually downloading and placing them into their npm folder. In the near future I will either find a better way to store archetypes or create an archetype repository app myself. Either way, I will build an *add* command that will install new archetypes by name so that I don't have to do a new release for each new archetype, and so that users can simply install the additional archetypes they want.

I will add better error handling and messages soon.

I will refactor the code soon to clean it up and make it better suited for others to make contributions.

<a name="bugs"/>
## Issues and Bugs
Please report issues here:
[https://github.com/NickSuwyn/archgen/issues](https://github.com/NickSuwyn/archgen/issues)

Also, feel free to contribute to fix issues and make archgen better!
[https://github.com/NickSuwyn/archgen](https://github.com/NickSuwyn/archgen)
