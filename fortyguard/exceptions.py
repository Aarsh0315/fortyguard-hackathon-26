class FortyGuardError(Exception):
    """Any error returned by the FortyGuard API."""


class TaskFailedError(FortyGuardError):
    """The async task finished with status=failed."""


class TaskTimeoutError(FortyGuardError):
    """The async task did not finish within the polling budget."""
