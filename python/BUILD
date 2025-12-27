load("@rules_python//python:defs.bzl", "py_binary")
load("@my_python_deps//:requirements.bzl", "requirement")

py_binary(
    name = "main",
    srcs = ["main.py"],
    deps = [
        requirement("requests"),
    ],
)
