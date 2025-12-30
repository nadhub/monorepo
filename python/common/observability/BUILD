load("@rules_python//python:defs.bzl", "py_library")

py_library(
    name = "observability",
    srcs = [
        "langfuse_tracer.py",
        "noop_tracer.py",
        "tracer_interface.py",
    ],
    visibility = ["//visibility:public"],
    deps = [
        # In a real monorepo, these would be:
        # "@pypi//langfuse",
        # "@pypi//openinference_instrumentation_google_genai",
        # For now, assuming they are available in the environment or via a central requirements rule
    ],
)
