# Tomcat JMX Metrics

Go to the website:
http://localhost:8080/test/

Test JMX connection:
```
jconsole localhost:9012 
```
Under *Catalina/RequestProcess/.../Attributes* you should see the `requestCount` increasing for each refresh of the `/test` page

Check on the integration
```
docker exec -it datadog-agent agent check tomcat  
```

## Resources

- [Doc on Autodiscovery template variables](https://docs.datadoghq.com/agent/faq/template_variables/)