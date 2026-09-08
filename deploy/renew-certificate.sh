#!/bin/sh
set -eu
if [ "${RENEWED_LINEAGE:-}" = /etc/letsencrypt/live/xn--kberloome-q9a.ee ]; then
    /usr/sbin/nginx -t
    /usr/bin/systemctl reload nginx
fi
