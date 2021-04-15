import fnmatch, re

SEARCH_PATTERN_1 = "*.percentile"
SEARCH_PATTERN_2 = "*[!p][!e][!r][!c][!e][!n][!t][!i][!l][!e]"
# SEARCH_PATTERN_2 = "*[!e][!n][!t][!i][!l][!e]"
# SEARCH_PATTERN_2 = "*[!n][!t][!i][!l][!e]"
# SEARCH_PATTERN_2 = "*[!t][!i][!l][!e]"
# SEARCH_PATTERN_2 = "*[!i][!l][!e]"
# SEARCH_PATTERN_2 = "*[!l][!e]"
SEARCH_PATTERN_3 = "*[!.][!p]"
metricnames = ["my_metric.percentile", "my_other_metric", "my_metric.hist", "my_metric.hercentile", "my_metric.percentilea", "my_metric.p", "another_metric", "and_another_p"]

def my_function(names, pattern):
    for n in names:
        if fnmatch.fnmatch(n, pattern):
            print("This is a match for {} on pattern {}".format(n, pattern))
        else:
            print("This is NOT a match for {} on pattern {}".format(n, pattern))

print('_________________')
print('')
my_function(metricnames, SEARCH_PATTERN_1)
print('_________________')
print('')
my_function(metricnames, SEARCH_PATTERN_2)
print('_________________')
print('')
my_function(metricnames, SEARCH_PATTERN_3)
