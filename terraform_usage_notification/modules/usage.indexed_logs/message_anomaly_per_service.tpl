{{#is_alert}}
Alert | Service {{service.name}} indexed log volume has an weird behavior.

*This monitor ensures that any overall indexed log volume per service does not spike unexpectly without notifying the relevant team.*

Instructions:

- Check the service volume
- Identify outliers
- Adjust exclusion filters if need be

For more details, check this [Logging without Limits guide](https://docs.datadoghq.com/logs/guide/getting-started-lwl)

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Service {{service.name}} indexed log volume is back to normal.
{{/is_recovery}}
