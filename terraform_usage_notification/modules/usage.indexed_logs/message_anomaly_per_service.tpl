{{#is_alert}}
Alert | Service {{service.name}} indexed log volume has an weird behavior.

Instructions:

- Check the index volume
- Identify outliers
- Adjust exclusion filters if need be

TODO: Add more details

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Service {{service.name}} indexed log volume is back to normal.
{{/is_recovery}}
