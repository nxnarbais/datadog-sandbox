{{#is_alert}}
Alert | The ${sku} SKU usage is increasing.

*This monitor ensures if the ${sku} SKU is increasing too much
compare to the period before the account owner can be notified.*

Instructions:

- Investigate main outlier - [dashboard](#)
- Contact owner to understand reason and adjust accordingly

${notifications_alert}
{{/is_alert}}

{{#is_recovery}}
Recovery | The ${sku} SKU usage is back to normal.
{{/is_recovery}}
