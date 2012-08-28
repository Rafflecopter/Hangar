Use launch for deploying node projects
https://github.com/bengourley/launch


put these in your package.json file (replace "cheeseburgers.com" with your host):  

    "launchconf": {
      "remote":     "app-data@cheeseburgers.com",
      "remotepath": "/var/builds/"
    },
    
    "devDependencies": {
      "launch" : ">=0.0.1"
    }


Set an alias:
  
    alias hangar='{path}/hangar'

Add path to your local repo as an env var:
  
    export HANGAR_PATH={path}

Jakefile.js is an example jakefile that you should put in your project directory.

Set your project's ENV variables by putting a file called envlive.js in a directory called "config" in your project directory.


CLI Usage
---------
**hangar addserver** {user}@{host} as {server_alias} [using {buildscript_name}] 
Configure the node server from clean Ubuntu 12.04 and refer to it from now on as {server_alias} using {buildscript_name} from the "builds" directory. {buildscript_name} defaults to node_redis_mongo.

**hangar listservers**  
List the servers that have been configured

**hangar createapp** {app_name} on {server_alias}  
Add upstart script for {app_name}. App can now be started and stopped

**hangar push**  
From inside the app repository this will run 'jake deploylive'
