{{#is_alert}}
Alert | Service {{service.name}} ingested log volume has reached a soft quota.

*This monitor ensures that any overall ingested log volume per service does not exceed a defined limit.*

Instructions:

- Check the service volume
- Identify outliers
- Adjust exclusion filters if need be
- Exclude this service from the monitor if this is an acceptable increase.

For more details, check this [Logging without Limits guide](https://docs.datadoghq.com/logs/guide/getting-started-lwl)

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Service {{service.name}} ingested log volume is back in an acceptable state.
{{/is_recovery}}
