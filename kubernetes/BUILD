load("@rules_helm//helm:defs.bzl", "helm_chart", "helm_install")

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

helm_chart(
    name = "chart",
    chart = "helm/Chart.yaml",
    templates = glob(["helm/templates/*"]),
    values = "helm/values.yaml",
)
