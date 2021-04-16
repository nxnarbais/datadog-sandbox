# Datadog Scripts

## Get started

### Step 1: Setup your monitoring (optional)

Copy `.env.example` to `.env`
```
cp .env.example .env
```

Edit the content to match your own org (not the customer). `DD_SITE` and `DD_API_KEY` are used to send traces and logs about the org-healthcheck app to your own Datadog org. This could be used from troubleshooting or for a simple demo.

### Step 2: Setup the dependencies

[Documentation](https://docs.python.org/3/tutorial/venv.html)

Install the dependencies.

1. Create the environment `python3 -m venv scriptenv`
2. Activate it `source scriptenv/bin/activate` (for Mac)
3. Install the packages `python -m pip install -r requirements.txt`
4. (optional) Check the packages `pip list`

If the dependencies are already installed, just activate the right env with `source scriptenv/bin/activate`.
