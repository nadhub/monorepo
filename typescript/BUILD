load("@npm//:defs.bzl", "npm_link_all_packages")

exports_files([
    "package.json",
    "pnpm-lock.yaml",
    ".npmrc",
    "pnpm-workspace.yaml",
])

# Link all npm packages from the pnpm-lock.yaml for workspace root
npm_link_all_packages(name = "node_modules")
