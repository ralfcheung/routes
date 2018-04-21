1. Assume that this application sits behind a group of load balancers and can be accessed by the load balancers only.
The ssl certificate would then be stripped out from the request and become a HTTP request.
This increase the speed of the request as application layer no longer has to deal with HTTPS traffic, which has a significant
performance impact. 

2. 