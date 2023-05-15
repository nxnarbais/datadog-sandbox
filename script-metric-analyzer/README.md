Custom Metrics Analyzer
=======================

[Original script](https://github.com/DataDog/Miscellany/blob/master/mwl_optimiser/mwl_optimiser.py)

This script is aimed to be added into AppScript and attached to a Google Sheet.

## Why
This script focused on the metrics that would highly benefit from MwL and the tag adjustment.

The goal is to identify out of the top metrics the ones with the highest potential.

## Get started

1. Create a new sheet
  1. Add tab `top_cm`
  1. Add tab `top_cm_analyzed`
1. Add script from below: Extensions > Apps Script
  1. Add the DD_API_KEY
  1. Add the DD_APP_KEY
  1. Edit the CUSTOM_METRIC_PRICE
1. Refresh the page to see the new menu item: `metric analyzer`
1. Get all top metrics: metric analyzer > get top custom metrics
  1. If necessary, edit the list from the tab `top_cm` for instance to reduce the list to the top 20
1. Get the analyzer working: metric analyzer > analyze top custom metrics
1. Be patient

[INTERNAL] Doc: https://docs.google.com/document/d/1daqAnXqakCy2_Pjie4KUc5I6UAC9BujctbXHxDHezLw/edit#  