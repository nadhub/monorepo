# gazelle:ignore
load("@rules_helm//helm:defs.bzl", "helm_chart", "helm_install", "helm_uninstall")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_load", "oci_push")
load("@rules_python//python:defs.bzl", "py_binary", "py_library")
load("@tar.bzl", "tar")

py_binary(
    name = "main",
    srcs = ["main.py"],
    visibility = ["//:__subpackages__"],
    deps = [
        "@pip//fastapi",
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

helm_chart(
    name = "chart",
    chart = "//kubernetes:helm/Chart.yaml",
    templates = ["//kubernetes:helm_templates"],
    values = "//kubernetes:helm/values.yaml",
)

helm_install(
    name = "app-1",
    helm_opts = [
        "--namespace",
        "my-ns",
        "--create-namespace",
        "--wait",
    ],
    install_name = "app-1",
    package = ":chart",
)

helm_uninstall(
    name = "uninstall",
    helm_opts = [
        "uninstall",  # Required verb
        "app-1",  # Argument 1: The release we actually want to uninstall
        "--namespace",
        "my-ns",
        "--wait",
        "--ignore-not-found",  # Argument: Ignore error when it tries to uninstall "uninstall" (the target name)
    ],
    install_name = "app-1",
)

py_library(
    name = "hello_world",
    srcs = ["main.py"],
    visibility = ["//:__subpackages__"],
    deps = ["@pip//requests"],
)
