{{#is_alert}}
Alert | Metric {{metric_name.name}} has an weird behavior.

*This monitor ensures that any metric name cardinality does not spike unexpectly without notifying the relevant team.*

Instructions:

- Check the usage attribution page and usage page
- Contact the team responsible for the metric or the increase
- Use Metrics without Limits in case of emergency (when the cardinality is too high and would cost too much)
- Review the actual value from this metric and act accordingly

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Metric {{metric_name.name}} cardinality is back to normal.
{{/is_recovery}}
