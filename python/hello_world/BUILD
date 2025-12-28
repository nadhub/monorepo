load("@rules_oci//oci:defs.bzl", "oci_image", "oci_load", "oci_push")
load("@rules_python//python:defs.bzl", "py_binary")
load("@tar.bzl", "tar")

py_binary(
    name = "main",
    srcs = ["main.py"],
    deps = [
        "@pip//requests",
    ],
)

tar(
    name = "main_tar",
    srcs = [":main"],
    tags = ["manual"],
)

oci_image(
    name = "main_image",
    base = "@debian_python_base",
    entrypoint = ["/python/hello_world/main"],
    tags = ["manual"],
    tars = [":main_tar"],
)

oci_load(
    name = "main_image_load",
    image = ":main_image",
    repo_tags = ["main_image:latest"],
)

oci_push(
    name = "push_image",
    image = ":main_image",
    remote_tags = ["latest"],
    repository = "index.docker.io/nadir20062010/hello_python",
)
