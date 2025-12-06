#!/bin/bash

pnpm exec concurrently \
  --names "types,api,web" \
  --prefix-colors "green.dim,blue,yellow" \
  --prefix "[{name}]" \
  --hide "types" \
  --kill-others-on-fail \
  "pnpm --filter @nest-nx-monorepo/shared-types dev" \
  "pnpm --filter @nest-nx-monorepo/api dev" \
  "pnpm --filter @nest-nx-monorepo/web dev"