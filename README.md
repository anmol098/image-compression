## Image Compression

This is a simple image compression api

there is an endpoint that accepts a post request with an image file and compression percentage between 0-100
then the image is compressed asynchronously and the compressed image is available to download


## prerequisites

- nodejs >= 17.5.0
- npm >= 8.4.1
- pm2
- docker >= 20.10.17
- redis running on port 6379 can be provided by env variable also not required if using docker to run the project


## installation

```shell
npm install
```

## how to run 

### development

```shell
npm run dev
```

### production

```shell    
npm run start
```

### docker

```shell
./startapp.sh run
```
make sure ./startapp.sh has execution permission

this will start app on port 3000

