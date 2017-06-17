# Sample README.md For Archetypes
When adding a new archetype please create a README.md that implements the following format and defines all variables required for the archetype.

Note that most archetypes should contain at least **project level variables: *name* and *entities***, (which are used to define the name of the project and an array of entities to be generated) **an entity level variables: *name* and *props*** (to define the name of the entity as well as an array of all properties for the entity), and **prop level variables: *name* and *type*** (that define the name and data type of the property). Other project, entity, and prop level variables can be defined, these are just the main variables that should exist unless you have a strong reason not to use them.

Sample format starts below. When creating an archetype README.md please add descriptive comments after each variable so that users will understand what each is used for. After the descriptor example, add any additional instructions. After a user runs a descriptor against your archetype and follows any additional instructions, the project should run as intended without any troubleshooting or additional steps, so please be detailed!
**------------------------------**

 # Archetype name
 
 Archetype description goes here.

 ```JavaScript
 //descriptor.json
 {
   //project level variables
   "name": "projectName", //name of project
   "connectionString": "abcdefg", //database connection string
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
- Any additional instructions to enable a generated project to run out of the box go here.
