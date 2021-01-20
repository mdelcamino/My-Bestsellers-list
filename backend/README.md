# Serverless BestSellers items List

A serverless project to make onself lists of bestsellers items (books, movies..)

# Functionality of the application

This application allows creating/removing/updating/fetching a bestsellers item. Each item can have an attachment image after its creation. 
Each user only has access to the items that has been created by himself.

# BestSellers items

The application stores items. Each item has the following fields:

* `bsId` (string) - a unique id for an item
* `userId` (string) - the authenticated id of the user
* `createdAt` (string) - date and time when the item was created
* `tittle` (string) - name of the item itself 
* `author` (string) - who the author of the item is
* `valuation` (string) - grade that the reader (or the list creator) valuates the item.
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to the item, for instance the cover of the book.


# Functions implemented

Functions implemented and configured in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetBS` - should return all items for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      {
  "author": "Miguel de Cervantes",
  "bsId": "5893ed98-4322-4290-88c3-65734e34eb40",
  "createdAt": "2021-01-19T10:50:06.976Z",
  "tittle": "El cerco de Numancia",
  "userId": "google-oauth2|108238406657076595877",
  "valuation": "7"
	}
    },
   {
  "author": "Paulo Coelho",
  "bsId": "f8285a33-c96d-4bf5-9e69-a4a3a268284f",
  "createdAt": "2021-01-18T18:00:53.360Z",
  "tittle": "Veronika decide morir",
  "userId": "google-oauth2|108238406657076595877",
  "valuation": "8,5"
}
  ]
}
```

* `CreateBS` - should create a new item for the current user. 

It receives a new item to be created in JSON format:

```json

{
  "author": "Paulo Coelho",
  "tittle": "Veronika decide morir",
  "valuation": "8,5"
}
```

It should return a new item that looks like this:

```json
{
  "item": {

  "author": "Paulo Coelho",
  "bsId": "f8285a33-c96d-4bf5-9e69-a4a3a268284f",
  "createdAt": "2021-01-18T18:00:53.360Z",
  "tittle": "Veronika decide morir",
  "userId": "google-oauth2|108238406657076595877",
  "valuation": "8,5"
}  
}
```

* `UpdateBS` - should update an item created by a current user. 

It receives an object that contains one field to be updated in the item; only "valuation" field can be changed:

```json
{

  "valuation": "8,5"
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteBS` - should delete an item created by a current user. Expects an id of the item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for an item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are connected to http events from the API Gateway.

Resources created are a DynamoDB table and a S3 bucket.


# Postman collection

To test the APIs "My BestSeller list" Postman collection is provided 

# Authentication

To implement authentication in the application, an Auth0 application has been created on this purpose. 
Values of "domain", "client id", "client secret", "audience" and a valid 24 hours token "auth" has been added as variables in the Postman collection.
Asymmetrically encrypted JWT tokens are being used.


```

# How to run the application

To deploy the application run the following commands:

```
npm install
sls deploy -v
```

