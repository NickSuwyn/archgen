# java-no-back

The java-no-back archetype is used to generate a starter SpringBoot application that demonstrates the use of controllers and a static service layer that contains ArrayLists() to cache entities created via the endpoints.

```JavaScript
//descriptor.json
{
  //project level variables
  "name": "projectName", //name of project
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

- Run ```archgen java-no-back```
- Run ```mvn clean install```
- Run ```mvn spring-boot:run```
