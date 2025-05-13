import {
  SecretsManagerClient,
  GetSecretValueCommand,
  ListSecretsCommand,
} from '@aws-sdk/client-secrets-manager';
import { ResourceNotFoundException } from '@aws-sdk/client-secrets-manager';
import { S3Client, GetObjectCommand, NoSuchKey } from '@aws-sdk/client-s3';
import { toTenant } from '../helpers/tenant';

//  Storage for tenant secrets
const TENANTS: Record<string, any> = {};

// Initialize AWS clients
const secretsClient = new SecretsManagerClient({});
const s3Client = new S3Client({});

export async function ingestTenantsFromAws() {
  try {
    const listCommand = new ListSecretsCommand({});
    const listResponse = await secretsClient.send(listCommand);

    if (!listResponse.SecretList?.length) {
      console.log('No secrets found in AWS Secrets Manager');
      return;
    }

    for (const secret of listResponse.SecretList) {
      try {
        // Try to get the secret with version stage
        const getCommand = new GetSecretValueCommand({
          SecretId: secret.Name,
          VersionStage: 'AWSCURRENT',
        });

        const getResponse = await secretsClient.send(getCommand);
        if (getResponse.SecretString) {
          try {
            // Try to parse as JSON, if it fails, store as string
            const secretData = JSON.parse(getResponse.SecretString);

            // Get additional configuration from S3
            try {
              const tenantName = secret.Name.split('/')[1]; // Extract tenant name from secret path
              const configCommand = new GetObjectCommand({
                Bucket:
                  process.env.TENANT_CONFIG_BUCKET ||
                  'dcc-brand-6e8f40c02581a52e',
                Key: `${tenantName}/config.json`,
              });

              const configResponse = await s3Client.send(configCommand);
              const configData = await configResponse.Body?.transformToString();

              if (configData) {
                const additionalConfig = JSON.parse(configData);
                TENANTS[secret.Name] = {
                  ...secretData,
                  config: additionalConfig,
                };
                console.log(
                  `Loaded secret: ${secret.Name
                  } with additional config: ${JSON.stringify(additionalConfig)}`
                );
              } else {
                TENANTS[secret.Name] = secretData;
              }
            } catch (s3Error) {
              if (s3Error instanceof NoSuchKey) {
                console.log(
                  `No additional configuration found in S3 for ${secret.Name}`
                );
              } else {
                console.error(
                  `Error fetching S3 config for ${secret.Name}:`,
                  s3Error
                );
              }
              TENANTS[secret.Name] = secretData;
            }
          } catch {
            TENANTS[secret.Name] = getResponse.SecretString;
          }
          console.log(`Loaded secret: ${secret.Name}`);
        }
      } catch (error) {
        if (error instanceof ResourceNotFoundException) {
          console.log(
            `Secret ${secret.Name} exists but has no current version. Skipping...`
          );
        } else {
          console.error(`Failed to load secret ${secret.Name}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Failed to list secrets:', error.message);
  }
}

// Function to fetch and store secrets for a tenant
export async function refreshSecretFor(tenant: string): Promise<void> {
  try {
    const secretResponse = await secretsClient.send(
      new GetSecretValueCommand({
        SecretId: `/tenants/${tenant}/credentials`,
        VersionStage: 'AWSCURRENT',
      })
    );

    if (secretResponse.SecretString) {
      try {
        TENANTS[tenant] = JSON.parse(secretResponse.SecretString);
      } catch {
        TENANTS[tenant] = secretResponse.SecretString;
      }
    }
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      console.log(`Secret for tenant ${tenant} exists but has no current version.`);
    } else {
      console.error(`Failed to fetch secrets for tenant ${tenant}:`, error);
    }
    throw error;
  }
}

export function getTenant(origin: string): any {
  const key = "tenant/" + toTenant(origin) + "/credentials";
  const tenant = TENANTS[key];
  if (!tenant) {
    throw Error("Tenant not found: " + key)
  }
  return tenant;
}
