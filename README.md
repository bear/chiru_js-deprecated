chiru
=====

chi(ru) chi(rasu) 
to scatter

Scatter tasks/jobs to workers

The core of Chiru is the Thoonk-Jobs.js library by my coworkers at [&yet](https://andyet.net).
See package.json details about other requirements.

At them moment all a Chiru worker does is receive a JSON manifest for a job, extract the
js script name and then run that from the given worker scripts directory (which for now is
assumed to be populated ahead of time.)

Usage
-----

Launching a worker:

  node worker.js

Launching the job service:

  node server.js

Configuration
-------------
Chiru uses the getconfig module to load the runtime configuration and will select dev_config.json or
production_config.json based on the NODE_ENV value at start: dev or production

See dev_config.json for the minimum configuration items.
