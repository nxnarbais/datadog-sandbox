{{#is_alert}}
Alert | Metric context has an weird behavior.

Instructions:

- Check the usage attribution page
- Check the usage reporting page
- Contact team
- Use MwL in case of urgency
- Exclude the metric_name from this monitor if justified

TODO: Add more details

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Metric context cardinality is back to normal.
{{/is_recovery}}
