#!/bin/bash
echo "Input: $1"

for i in {1..99999}
do
  curl 'http://localhost:9090/metrics'
  let "sleeptime=$[($RANDOM % $1) + 0]"
  echo "Sleep $sleeptime seconds until next execution"
  sleep $sleeptime
done