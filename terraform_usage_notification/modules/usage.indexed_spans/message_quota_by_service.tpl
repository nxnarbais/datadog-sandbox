{{#is_alert}}
Alert | Service {{service.name}} indexed span volume has reached a soft quota.

*This monitor ensures that any overall indexed span volume per service does not exceed a defined limit.*

Instructions:

- Check the service volume
- Identify outliers
- Adjust exclusion filters if need be
- Exclude this service from the monitor if this is an acceptable increase.

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Service {{service.name}} indexed span volume is back in an acceptable state.
{{/is_recovery}}
