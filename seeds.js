//roles
{
	"name" : "admin",
	"scopes" : ["user-get","user-edit","user-remove","school-create", "school-get", "profile-get", "profile-create","role-get","role-edit", "role-remove"]
}
{
	"name" : "principal",
	"scopes" : ["user-get","school-get", "profile-get"]
}
{
	"name" : "manager",
	"scopes" : ["user-get","user-edit","user-remove","school-get", "profile-get", "profile-create"]
}
//user
{
	"first_name" : "jayesh",
	"last_name" : "gupta",
	"password" : "jayesh123",
	"email"   : "jayesh@gmail.com",
	"mobile" : "+919522501528",
	"roleId" : "609b5b306534fc515c42be78"
}
//school
{
	"name" : "anand vihar school",
	"city" : "bhopal",
	"state" : "Madhya Pradesh",
	"country" : "India",
	"public_id" : "SCH-AVS"
}
//profile
{
	"first_name" : "divyansh",
	"last_name" : "sahu",
	"userId" : "609b64b61230f131589ecf24",
	"schoolId" : "609b62049ebecd251c601a0f"
}