#!/bin/bash
npm run typeorm migration:run
if [[ -z "${ENABLE_TRACING}" ]]; then npm run start:prod; else npm run start:prod-tracing; fi