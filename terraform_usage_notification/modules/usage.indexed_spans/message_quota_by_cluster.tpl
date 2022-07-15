{{#is_alert}}
Alert | Cluster {{kube_cluster_name.name}} indexed span volume has reached a soft quota.

*This monitor ensures that any overall indexed span volume per cluster does not exceed a defined limit.*

Instructions:

- Check the index volume
- Identify outliers
- Adjust exclusion filters if need be
- Exclude this index from the monitor if this is an acceptable increase.

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Cluster {{kube_cluster_name.name}} indexed span volume is back in an acceptable state.
{{/is_recovery}}
