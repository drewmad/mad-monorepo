# CI Optimization

This project uses GitHub Actions for automated testing and builds. To speed up workflow execution we cache dependencies and reuse build steps where possible.

## Dependency Caching

A dedicated workflow `.github/workflows/cache-warmup.yml` installs all dependencies on a schedule. Because the `actions/setup-node` step caches the pnpm store, subsequent CI runs restore packages without downloading them again.

## Build Helpers

Two helper scripts streamline CI builds:

- `scripts/ci-build.sh` – builds a workspace package with Turborepo caching enabled.
- `scripts/fix-storybook-build.sh` – builds the UI package and Storybook documentation to ensure docs compile correctly.

Both scripts are referenced from `ci.yml` and can also be run locally via `pnpm build:ci` or directly.

## Environment

The `.env.ci` file provides placeholder environment variables for CI jobs. It disables telemetry and enables E2E tests.
