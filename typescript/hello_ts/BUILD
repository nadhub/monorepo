load("@aspect_rules_js//js:defs.bzl", "js_binary")
load("@aspect_rules_ts//ts:defs.bzl", "ts_project")

ts_project(
    name = "main",
    srcs = ["main.ts"],
    declaration = True,
    transpiler = "tsc",
    tsconfig = "tsconfig.json",
)

js_binary(
    name = "main_runner",
    entry_point = "main.js",
)
