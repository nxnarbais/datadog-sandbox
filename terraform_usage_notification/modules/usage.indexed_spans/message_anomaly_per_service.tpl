{{#is_alert}}
Alert | Service {{service.name}} indexed span volume has an weird behavior.

*This monitor ensures that any overall indexed span volume per service does not spike unexpectly without notifying the relevant team.*

Instructions:

- Check the service volume
- Identify outliers
- Adjust exclusion filters if need be

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Service {{service.name}} indexed span volume is back to normal.
{{/is_recovery}}
