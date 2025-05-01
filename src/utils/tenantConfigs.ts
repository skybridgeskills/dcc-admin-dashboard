import {
    SecretsManagerClient,
    GetSecretValueCommand,
    ListSecretsCommand,
} from '@aws-sdk/client-secrets-manager';
import { ResourceNotFoundException } from '@aws-sdk/client-secrets-manager';
import { toTenant } from '../helpers/tenant';

//  Storage for tenant secrets
const TENANTS: Record<string, any> = {};

// Initialize secrets manager client
const secretsClient = new SecretsManagerClient({});

export async function ingestSecrets() {
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
                        TENANTS[secret.Name] = JSON.parse(getResponse.SecretString);
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
    return TENANTS[`/tenants/${toTenant(origin)}/credentials`];
}
