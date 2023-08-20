{{#is_alert}}
Alert | Selected context indexed span volume has an weird behavior.

*This monitor ensures that any overall indexed span volume from a specific context does not spike unexpectly without notifying the relevant team.*

Instructions:

- Check the context volume
- Identify outliers
- Adjust exclusion filters if need be

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Selected context indexed span volume is back to normal.
{{/is_recovery}}
