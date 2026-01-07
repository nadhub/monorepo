load("@rules_helm//helm:defs.bzl", "helm_chart", "helm_install", "helm_uninstall")

exports_files([
    "helm/Chart.yaml",
    "helm/demo-mkt-front-values.yaml",
])

filegroup(
    name = "helm_templates",
    srcs = glob(["helm/templates/*"]),
    visibility = ["//visibility:public"],
)

helm_install(
    name = "monorepo",
    helm_opts = [
        "--namespace",
        "my-ns",
        "--create-namespace",
        "--wait",
    ],
    package = ":chart",
)

helm_uninstall(
    name = "uninstall",
    helm_opts = [
        "uninstall",  # Required verb
        "monorepo",  # Argument 1: The release we actually want to uninstall
        "--namespace",
        "my-ns",
        "--wait",
        "--ignore-not-found",  # Argument: Ignore error when it tries to uninstall "uninstall" (the target name)
    ],
)

helm_chart(
    name = "chart",
    chart = "helm/Chart.yaml",
    templates = glob(["helm/templates/*"]),
    values = "helm/demo-mkt-front-values.yaml",
)
