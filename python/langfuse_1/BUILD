load("@rules_python//python:defs.bzl", "py_binary", "py_library")

py_library(
    name = "config",
    srcs = ["config.py"],
    visibility = ["//visibility:public"],
    deps = [
        # "@pypi//pydantic",
        # "@pypi//pydantic_settings",
    ],
)

py_binary(
    name = "main",
    srcs = ["main.py"],
    deps = [
        ":config",
        "//python/common/observability",
        "//python/langfuse_1/core",
    ],
)
