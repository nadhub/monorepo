load("@rules_oci//oci:defs.bzl", "oci_image")
load("@rules_pkg//pkg:tar.bzl", "pkg_tar")
load("@rules_python//python:defs.bzl", "py_binary")
load("@my_python_deps//:requirements.bzl", "requirement")

py_binary(
    name = "main",
    srcs = ["main.py"],
    deps = [
        requirement("requests"),
    ],
)

pkg_tar(
    name = "main_tar",
    srcs = [":main"],
)

oci_image(
    name = "main_image",
    base = "@debian_python_base",
    tars = [":main_tar"],
    entrypoint = ["/main"],
)
