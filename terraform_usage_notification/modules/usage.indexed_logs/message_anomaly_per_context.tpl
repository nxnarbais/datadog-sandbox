{{#is_alert}}
Alert | Selected context indexed log volume has an weird behavior.

*This monitor ensures that any overall indexed log volume from a specific context does not spike unexpectly without notifying the relevant team.*

Instructions:

- Check the context volume
- Identify outliers
- Adjust exclusion filters if need be

For more details, check this [Logging without Limits guide](https://docs.datadoghq.com/logs/guide/getting-started-lwl)

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Selected context indexed log volume is back to normal.
{{/is_recovery}}
