var share = {}, // Shared info between the
                // Jakefile tasks and the launch tasks
  action = require('launch')(share).action; // Get the launch actions,
                                            // passing in the shared var


/*
 * Run with `jake deploylive`. Depends on `setenvlive` and `restart`
 * which are defined in this file, and `launch:installdeps` which is
 * provided by launch. The task itself is empty, the important things
 * are its dependencies being called in order.
 */
desc('Deploy the current branch to the live environment');
task('deploylive', ['shrinkwrap', 'setenvlive', 'launch:symlink', 'setvars', 'restart'], function () {
});

/*
 * npm shrinkwrap to lockdown versions of dependencies 
 */
desc('Lock down dependency versions');
task('shrinkwrap', function() {
  action.local('npm shrinkwrap', function(exitcode) {
    if (exitcode === 0) {
      action.success('Dependency versions locked down with npm shrinkwrap');
      complete();
    } else {
      action.error('npm shrinkwrap failed');
      fail();
    }
  });
}, true);

/*
 * Sets the environment variables on the production machine
 * Also, removes the shrinkwrap file
 */
desc('Sets the environment variables');
task('setvars', ['launch:symlink'], function () {
  action.local('rm npm-shrinkwrap.json', function() {})
  action.local('rsync -arvz ' +  share.info.name + '/config/envlive.js ' 
    + share.info.remote + ':' + share.linkpath + share.info.name
    + '/' + share.info.name + '/config/local.js', function(exitcode) {
      if (exitcode === 0) {
        action.success('Configured production build env vars');
        complete();
      } else {
        action.error('Could not configure env vars Make sure config/envlive.js exists');
        fail();
      }
  })
}, true);

/*
 * Sets the optional enviroment on the shared object
 * to `live`, which is used by a launch task when operating
 * with the remote filesystem. This task depends on the
 * launch task `launch:info` to gather the remote info.
 */
desc('Sets the environment to live');
task('setenvlive', ['launch:info'], function () {
  share.env = 'live';
});


/*
 * A custom task of mine to restart the the site/app
 * (I use upstart). This shows how to execute an arbitrary
 * remote command with launch's `action`s.
 */
desc('Restarts the server given an `env`');
task('restart', ['setenvlive'], function () {

  if (!share.env) {
    action.error('`env` is not set.');
    fail();
  }

  var svc_name = share.info.name + '-' + share.env;

  action.remote(share.info.remote,
    'sudo stop ' + svc_name + ' && '
    + 'sudo start ' + svc_name, function (exitcode, stdout) {
      if (exitcode === 0) {
        action.success('The site service restarted.');
        action.notice('Check manually to verify that the site is running.')
        complete()
      } else {
        action.notice('The site was already in the stopped state. Starting...')
        action.remote(share.info.remote, 'sudo start ' + svc_name, function(exitcode) {
          if (exitcode === 0) {
            action.success('The site service started.');
            action.notice('Check manually to verify that the site is running.')
            complete()
          } else {
            action.error('Failed to restart site');
            fail();
          }
        });
      }
    });

}, true);
