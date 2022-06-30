{{#is_alert}}
Alert | Index {{index_name.name}} volume has reached a soft quota.

Instructions:

- Check the index volume
- Identify outliers
- Adjust exclusion filters if need be

TODO: Add more details

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | Index {{index_name.name}} volume is back in an acceptable state.
{{/is_recovery}}
