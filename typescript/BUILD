load("@aspect_rules_ts//ts:defs.bzl", "ts_project")
load("@aspect_rules_js//js:defs.bzl", "js_binary")

ts_project(
    name = "main",
    srcs = ["main.ts"],
    tsconfig = "tsconfig.json",
    transpiler = "tsc",
    source_map = True,
)

js_binary(
    name = "main_runner",
    entry_point = "//typescript:main.js",
)
