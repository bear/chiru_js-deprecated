chiru
=====

chi(ru) chi(rasu) 
to scatter

Scatter tasks/jobs to workers

Requires NodeJS v0.8.* minimum. The code has not been tested with NodeJS v0.10.*

The core of Chiru is the Thoonk.js library by my coworkers at &yet - see package.json
details about other requirements.

At them moment all a Chiru worker does is receive a JSON manifest for a job, extract the
js script name and then run that from the given worker scripts directory (which for now is
assumed to be populated ahead of time.)



Usage
-----

1. create a configuration file to point to redis
2. launch at least one worker - it will create the job infrastructure if it doesn't exist.
3. profit? well, ok, maybe not - but you will have a single worker running waiting for, well, work.

Launching a worker:

  node worker.js

Launching the job monitor:

  node monitor.js

Configuration
-------------
Chiru uses the getconfig module to load the runtime configuration and will select dev_config.json or
production_config.json based on the NODE_ENV value at start: dev or production

See dev_config.json for the minimum configuration items.

TODO
----
* add zeromq proxy to allow workers to live outside of the firewall
* worker attributes should be pushed to a redis entry for the worker with
** worker attributes
** worker assets
*** internet: wifi, ipv4, ipv6
*** os: debian, ubuntu, version
*** languages: python, node, ruby, bash
*** maximums for drive, memory, etc
