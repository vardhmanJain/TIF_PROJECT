# TIF_PROJECT
### Link to problem statement : https://drive.google.com/file/d/1Na-cfZcj8QOrKLlf5stm5OfEFKrdN8Xd/view

A summary of the problem is given below : 
You run an EdTech-Management SaaS company. On your platform, Schools are registered, along with their Students.

To restrict access, you use Scope-based system, 
where any Role (ex: Admin, Student, Principal) 
must have a scope (ex: school-create, user-get) with them 
to perform any actions on the resources (ex: User, School)

## The Libraries used are :
* mongoose
* Express Validator (https://www.npmjs.com/package/express-validator)
* jsonwebtoken (https://www.npmjs.com/package/jsonwebtoken)
* Phone (for phone number validation, https://www.npmjs.com/package/phone)

### The Endpoints are
* User: 
  * Signup
  * Sign in 
  * Get Single -> user-get
  * Get List -> user-get
  * Update  Single -> user-edit
  * Remove Single -> user-remove
* Profiles: 
  * Create -> profile-create
  * Get List -> profile-get
* School
  * Create -> school-create
  * Get All -> school-get
  * Get All Students -> school-get
* Role
  * Create
  * Get List -> role-get
  * Update Single -> role-edit
  * Remove Single -> role-remove

### User Model
` Table User as U {
  _id ObjectId, 
  first_name String, 
  last_name String, 
  email String [unique], 
  mobile String [unique], 
  password String, 
  created DateTime, 
  roleId ObjectId [ref: > Role._id, default: null], 
  updated DateTime
} `

### Profile Model
`Table Profile {
  _id ObjectId, 
  first_name String, 
  last_name String, 
  userId ObjectId,   
  schoolId ObjectId, 
  created DateTime, 
  updated DateTime
} `

### Role Model
`Table Role {
  _id ObjectId, 
  name String, 
  scopes Array(String), 
  created DateTime, 
  updated DateTime
}`

### School Model
`Table School as S {
  _id ObjectId, 
  public_id ObjectId [unique], 
  name String, 
  city String, 
  state String, 
  country String, 
  created DateTime, 
  updated DateTime
}
`

### Payload of token will look like
{  
    "user":{  
        "_id":"60265e46d560814bb5a8e8bc",  
        "first_name":"Ranchoddas",  
        "last_name":"Chanchad",  
        "email":"rancho@mailinator.com" ,  
        "mobile":"+911234567890",  
        "created":"2021-02-12T10:55:51.306Z",  
        "updated":null,  
        "role":{  
            "_id":"60265e46d560814bb5a8e8bc",  
            "name":"Manager",  
            "scopes":["user-get", "user-edit", "school-get", "school-create", "school-edit"]  
        }  
    }  
}  


