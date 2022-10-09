## Image Compression

This is a simple image compression api

there is an endpoint that accepts a post request with an image file and compression percentage between 0-100
then the image is compressed asynchronously and the compressed image is available to download


## prerequisites

- nodejs >= 17.5.0
- npm >= 8.4.1
- pm2
- docker >= 20.10.17
- redis running on port 6379 
  - host and port can be provided by env variable also 
  - if using docker to run the project then these details are not required


## installation

```shell
npm install
```

# How to run 
## In local machine
### development

```shell
npm run dev
```

### production

```shell    
npm run start
```

## Using Docker

### docker

start the docker engine and run the following command

```shell
./startapp.sh run
```
make sure `./startapp.sh` has execution permission
this will start app on port 3000

```shell
./startapp.sh stop
```
this will stop the app

```shell
./startapp.sh clean
```
this will remove all the stopped container and images


For more information about the api please check the postman collection attached in repository

### swagger

swagger documentation is available at /api-docs
http://localhost:3000/api-docs/
