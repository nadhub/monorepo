load("@rules_helm//helm:defs.bzl", "helm_chart")

helm_chart(
    name = "monorepo_chart",
    chart = "//kubernetes/helm:Chart.yaml",
    values = "//kubernetes/helm:values.yaml",
    templates = ["//kubernetes/helm/templates:deployment.yaml"],
)