{{#is_alert}}
Alert | Anomaly on overall custom metric volume.

*This monitor ensures that the overall volume of custom metric is consistent over time.*

Instructions:

- Check the usage attribution page and usage page
- Contact the team responsible for the metric or the increase
- Use Metrics without Limits in case of emergency (when the cardinality is too high and would cost too much)
- Review the actual value from this metric and act accordingly

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Overall custom metric volume is back to normal.
{{/is_recovery}}
