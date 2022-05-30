# Download Datadog Usage

## Description
Download usage data from the Datadog API

## Script

Input

- API key
- App key

Output

- Multiple output depending on the data type

## How to

1. Create environment with `python3 -m venv venv`
1. Activate it `source venv/bin/activate`
1. Activate it `. venv/bin/activate`
1. Install dependencies
    1. `pip install requests`
1. Edit
    1. my_api_key
	1. my_app_key
    1. https://api.datadoghq.com/(if in EU)
1. Start script `python3 download_usage.py`
1. Expand script and load result in any tool