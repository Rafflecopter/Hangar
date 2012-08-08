Use launch for deploying node projects
https://github.com/bengourley/launch

put these in your package.json file:

    "launchconf": {
      "remote":     "app-data@<host>",
      "remotepath": "/var/builds/"
    },
    
    "devDependencies": {
      "launch" : ">=0.0.1"
    }



Set an alias:  
alias hangar='{path}/hangar'

Add path to your local repo as an env var:  
export HANGAR_PATH={path}


**hangar addserver** {user}@{host} as {server_alias}  
Configure the node server from clean Ubuntu 12.04 and refer to it from now on as <server_alias>

**hangar listservers**  
List the servers that have been configured

**hangar createapp** {app_name} on {server_alias}  
Add upstart script for {app_name}. App can now be started and stopped

**hangar push**  
From inside the app repository this will run 'jake deploylive'
