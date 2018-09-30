# Pizza API.

### Starting:

* Generate key:
  
	```openssl req -newkey rsa:2048 -new -nodes x509 -days 3650 -keyout key.pem -out cert.pem```
* Copy generated keys to `https` folder in project:

	```cp {key_folder}/cert.pem {key_folder}/key.pem  {project_folder}/https/```


* Run server with environments: 'production' or 'staging':

	```NODE_ENV=staging node index.js```

* Both servers (http and https) will be started.

### API
#### errors
	Status: 400.
	Response is array. Example:
		[
			"not valid phone number",
			"address must be longer than 7 characters",
			"password must be longer than 7 characters",
			"you shoud accept our Terms of Service"
		]	
#### /users
	Create user:
		Request:
			curl -X POST \
				http://localhost:5000/users \
				-H 'Content-Type: application/json' \
				-d '{
					"name": "newUser",
					"email": "admin@exampl.com",
					"phone": "2222222222",
					"address": "address new",
					"tosAgreement": true,
					"password": "so secret"
				}'
		Status: 201
		Response:
			{
				"name": "newUser",
				"email": "admin@exampl.com",
				"phone": "2222222222",
				"address": "address new",
				"tosAgreement": true
			}
	
	Update user:
		Request:
			curl -X PUT \
				http://localhost:5000/users \
				-H 'Content-Type: application/json' \
				-H 'token: AVFU2QME9LvJs6fytnlB' \
				-d '{
					"address": "new new new",
					"phone": "2222222222"
				}'
		Status: 200
		Response:
			{
				"name": "newUser",
				"email": "admin@exampl.com",
				"phone": "2222222222",
				"address": "new new new",
				"tosAgreement": true
			}
	
	Get user:
		Request:
			curl -X GET \
			'http://localhost:5000/users?phone=2222222222' \
			-H 'token: AVFU2QME9LvJs6fytnlB'
		Status: 200
		Response:
		{
			"name": "newUser",
			"email": "admin@exampl.com",
			"phone": "2222222222",
			"address": "new new new",
			"tosAgreement": true
		}

	Delete user:
		Request:
			curl -X DELETE \
			'http://localhost:5000/users?phone=2222222222' \
		Status: 200
		Response:
			{
				"name": "newUser",
				"email": "admin@exampl.com",
				"phone": "2222222222",
				"address": "new new new",
				"tosAgreement": true
			}

#### /auth
	Create token:
		Request:
			curl -X POST \
			http://localhost:5000/auth \
			-H 'Content-Type: application/json' \
			-d '{
				"phone": "2222222222",
				"password": "so secret"
			}'	
		Status: 201
		Response:
			{
				"id": "AVFU2QME9LvJs6fytnlB",
				"phone": "2222222222",
				"expires": 1538237093718
			}
	
	Update token:
		Request:
			curl -X PUT \
				http://localhost:5000/auth \
				-H 'Content-Type: application/json' \
				-d '{
					"id": "AVFU2QME9LvJs6fytnlB",
				"extend": true
			}'
		Status: 200
		Response:
		{
			"id": "AVFU2QME9LvJs6fytnlB",
			"phone": "2222222222",
			"expires": 1540826203640
		}
	
	Get token:
		Request:
			curl -X GET \
				'http://localhost:5000/auth?id=AVFU2QME9LvJs6fytnlB' \
				-H 'Cache-Control: no-cache' \
				-H 'Content-Type: application/json' \
				-H 'Postman-Token: 0e575eef-0b98-4d19-932a-de591829a85e'
		Status: 200
		Response:
			{
				"id": "AVFU2QME9LvJs6fytnlB",
				"phone": "2222222222",
				"expires": 1540826203640
			}
	
	Delete token:
		Request:
			curl -X DELETE \
				'http://localhost:5000/auth?id=AVFU2QME9LvJs6fytnlB' \
		Status: 200
		Response:
			{}

#### /menues
	Get all menues:
		Request:
			curl -X GET \
				'http://localhost:5000/menues?phone=2222222222' \
				-H 'Content-Type: application/json' \
				-H 'token: AVFU2QME9LvJs6fytnlB'
		Status: 200
		Response:
			[
				{
					"id": 1,
					"title": "Pizza Pepperoni Blues",
					"ingredients": [
							"Mozarella",
							"Bergader Blue",
							"Peperoni",
							"Al'fredo sauce"
					],
					"price": "4.30",
					"image": "https://media.dominos.ua/__sized__/menu/product_osg_image/2018/03/30/%D0%BF%D0%B5%D0%BF%D0%BF%D0%B5%D1%80%D0%BE%D0%BD%D0%B8_%D0%B1%D0%BB%D1%8E%D0%B7-thumbnail-2300x2300-70.jpg"
				},
				{ ... }
			]

