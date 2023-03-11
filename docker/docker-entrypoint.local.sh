#!/bin/bash
mkdir -p /root/.oci
printf "[DEFAULT]\nuser=${OCI_USER}\nfingerprint=${OCI_FINGERPRINT}\ntenancy=${OCI_TENANCY}\nregion=${OCI_REGION}\nkey_file=/root/.oci/oracle-api.pem\n"
printf "[DEFAULT]\nuser=${OCI_USER}\nfingerprint=${OCI_FINGERPRINT}\ntenancy=${OCI_TENANCY}\nregion=${OCI_REGION}\nkey_file=/root/.oci/oracle-api.pem\n" > /root/.oci/config

# an oracle-api.pem key file needs to be set in /root/.oci/oracle-api.pem (mounted in docker-compose)
# if they key is not there oracli cli will not be able to authenticate
# failed authentication will prevent from downloading the wallet, which is necessary for db connection (auth)
/root/bin/oci setup repair-file-permissions --file /root/.oci/config
/root/bin/oci setup repair-file-permissions --file /root/.oci/oracle-api.pem
/root/bin/oci db autonomous-database generate-wallet --autonomous-database-id=${OCI_ADB_ID} --password=${DB_PASSWORD} --file=wallet.zip

unzip wallet.zip -d /usr/lib/instantclient_21_9/network/admin/
export PATH="$PATH:/usr/lib/instantclient_21_9"

# compile node-oracledb for arm64
tar -xzf libs/oracledb-src-5.5.0.tgz -C libs/
mv libs/package libs/oracledb
cd libs/oracledb && npm run buildbinary && npm run buildpackage

cd /app
npm install --no-optional
npm run start:debug
chmod -R 777 /app/src/migrations
