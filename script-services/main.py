from config import config
from libs.metrics.index import get_services

print(get_services(config, ['env', 'geo', 'service']))