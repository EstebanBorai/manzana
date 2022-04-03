#!/bin/bash

# Environment Variables Required
# 
# - CF_ACCOUNT_ID: Account ID from Cloudflare
# - CF_ZONE_ID: Zone ID from Cloudflare

WORKER_NAME="home"

echo -e "type = 'javascript'\nname = 'manzana'\nroute = 'manzana.estebanborai.com/*'\ncompatibility_date = '2022-04-02'\naccount_id = '$CF_ACCOUNT_ID'\nworkers_dev = false\nzone_id = '$CF_ZONE_ID'\n\n[site]\nbucket = './build'\nentry-point = 'workers-site'\n\n[build]\ncommand = 'npm run build:docs'\nwatch_dir = 'app'\n\n[build.upload]\nformat = 'service-worker'" > wrangler.toml