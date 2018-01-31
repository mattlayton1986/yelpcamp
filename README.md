# YelpCamp webapp

## Based on the YelpCamp project from Colt Steele's [Web Developer Bootcamp](https://www.udemy.com/the-web-developer-bootcamp/) course on [Udemy](https://www.udemy.com).

## About branches

### Version Branches
Version branches (e.g., v1, v2, etc.) correspond to Colt's version files on c9.io. Whenever he moves to a new version of the project in the course, I created a new branch to better keep track of discrete changes in the app that form a block of learning.

### Master Branch
The master branch contains the composite of the entire web application. After each version branch is complete, I've merged the branch back into master, while preserving the version branches for reference.

## Questions

### Udemy
* [campground.\_id versus req.params.id](https://www.udemy.com/the-web-developer-bootcamp/learn/v4/questions/3596390)  

  * referenced in above answer: [What is the difference between id and \_id in mongoose?](https://stackoverflow.com/questions/15724272/what-is-the-difference-between-id-and-id-in-mongoose/15724424#15724424) (from Stack Overflow)

  * referenced in above answer: [BSON types > ObjectId](https://docs.mongodb.com/manual/reference/bson-types/#objectid) (from MongoDB docs)

* [Confused about password.authenticate syntax](https://www.udemy.com/the-web-developer-bootcamp/learn/v4/questions/3600388) 

### Stack Overflow
Oops -- I haven't posted any questions on Stack Overflow yet about this project. Check back later!

## Notable errors encountered during this project
* `Error: listen EADDRINUSE :::3000` (when running `node app.js`): [SO Answer](https://stackoverflow.com/a/30163868)

## Excluded Files
* `node_modules` directory: modules are included in package.json and can be installed in local directory via npm after cloning this repository.