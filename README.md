1. Run 'docker-compose up --build' to run the app

2. Assume that this application sits behind a group of load balancers and can be accessed by the load balancers only.
The ssl certificate would then be stripped out from the request and become a HTTP request.
This increase the speed of the request as application layer no longer has to deal with HTTPS traffic, which has a significant
performance impact. 

3. If the request takes too long to load, cancel and run the request again as the hold up is caused 
by the memcached's network with docker (using bridge mode), there is a big performance hit.

4. The use of memcached as cache is just for demo only, it can easily substitute to other 
in-memory databases like Redis. If memcached is used, it can be easily 
scaled up by adding more instances to the list of memcached servers (not performed here) 

5. In the real production environment, the request to create a route info would be sent to a MQ  
to offload the loading of the application, and processed by other consumers.

6. The errors are captured by Raven and automatically sends notification/email to the admin whenever
an error occurs (e.g. disconnected from database or memcached cluster)

7. MongoDB is used to scale the database layer horizontally.

8. To run the tests, you can use IntelliJ IDEA to run the test and show the test coverage

9. The application is managed by PM2, when the application crashed, PM2 automatically restarts the app 
