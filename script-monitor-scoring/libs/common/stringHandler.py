import logging

logger = logging.getLogger("mastermind_logger")


def isMatchingRegex(stringToMatch, rgx):
    # logger.info("utils.stringHanndler.isMatchingRegex - stringToMatch:[{}] regex:[{}]".format(stringToMatch, rgx))
    if type(stringToMatch) is str:
        if rgx.search(stringToMatch):
            return True
        else:
            return False
    else:
        logger.error(
            "utils.stringHandler.isMatchingRegex Parameter is not of type string type:'{}' param:'{}'".format(
                type(stringToMatch), stringToMatch
            )
        )
        return False
