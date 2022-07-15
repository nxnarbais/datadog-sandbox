{{#is_alert}}
Alert | Metric {{metric_name.name}} cardinality has reached a soft quota.

*This monitor ensures that any metric name with a cardinality above the threshold is sending an alert.
It ensures that admins have the right conversation with the end user and review the value of the metric.*

Instructions:

- Check the usage attribution page and usage page
- Contact the team responsible for the metric or the increase
- Use Metrics without Limits in case of emergency (when the cardinality is too high and would cost too much)
- Review the actual value from this metric and act accordingly
- Finally, exclude the metric_name from this monitor if going above quota is justified

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Metric {{metric_name.name}} cardinality is back in an acceptable state.
{{/is_recovery}}
