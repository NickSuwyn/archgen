# mean-ts

The mean-ts archetype is used to generate a full stack, full CRUD project using the MEAN stack(MongoDB, ExpressJS, AngularJS, and NodeJS) in TypeScript.

```JavaScript
//descriptor.json
{
  //project level variables
  "name": "projectName", //name of project
  "connection": "abcdefg", //database connection string
  "entities": [ //array of project entities
    {
      "name": "someName", //entity name
      "props": [ //entity properties
        {
          "name": "someName", //name of property
          "type": "someDataType" //data type of property
        }      
      ]
    }
  ]  
}
```

- Run ```archgen mean-ts```
- Run ```npm install```
- Run ```bower install```
- Run ```tsc``` **Note: you may see errors at this step saying there are missing commas or semicolons, these are safe to ignore and the project should still build and run.**
