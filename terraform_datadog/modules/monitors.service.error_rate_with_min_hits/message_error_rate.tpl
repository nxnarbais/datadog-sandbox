{{#is_alert}}
Alert | Service {{service.name}} error rate is too high

Instructions:

1. Check system metrics on [this dashboard](https://app.datadoghq.com/dash/integration/1?tpl_var_scope=host%3A{{host.name}})
2. If <CONDITION>, read [internal documentation]() for further instructions
3. If <CONDITION>, read [internal documentation]() for further instructions
{{/is_alert}}

{{#is_warning}}
Warning | Service {{service.name}} error rate is higher than expected

Instructions:

1. Check system metrics on [this dashboard](https://app.datadoghq.com/dash/integration/1?tpl_var_scope=host%3A{{host.name}})
2. Ensure responsible teams are aware. (Check the [infrastructure list to identify the team](https://app.datadoghq.com/infrastructure?filter={{host.name}}))
{{/is_warning}} 

{{#is_recovery}}
We are recovering!

Instructions:

1. Write a post-mortem on a [notebook](https://app.datadoghq.com/notebook)
{{/is_recovery}}

{{#is_no_data}}
No Data | Service {{service.name}} is no longer reporting metrics.
{{/is_no_data}} 

Alert details: 

- env: {{env.name}}
- team: {{team.name}}
- service: {{service.name}}
- thresholds: {{threshold}} 
- value: {{value}} 
- last_triggered_at: {{last_triggered_at}}