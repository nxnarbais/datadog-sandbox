FROM wordpress:6.2.1-apache

RUN curl -LO https://github.com/DataDog/dd-trace-php/releases/latest/download/datadog-setup.php

RUN php datadog-setup.php --php-bin=all --enable-appsec --enable-profiling

ARG env[DD_ENV]=$DD_ENV
ARG env[DD_SERVICE]=$DD_SERVICE
ARG env[DD_VERSION]=$DD_VERSION

# RUN PassEnv $DD_ENV
# RUN PassEnv $DD_SERVICE
# RUN PassEnv $DD_VERSION