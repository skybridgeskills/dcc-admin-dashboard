import {
    SecretsManagerClient,
    GetSecretValueCommand,
    ListSecretsCommand,
} from '@aws-sdk/client-secrets-manager';

// Global storage for tenant secrets
export const tenantSecrets: Record<string, any> = {};

// Initialize secrets manager client
const secretsClient = new SecretsManagerClient({});

export async function injestSecrets() {
    try {
        const listCommand = new ListSecretsCommand({});
        const listResponse = await secretsClient.send(listCommand);

        if (!listResponse.SecretList?.length) {
            console.log('No secrets found in AWS Secrets Manager');
            return;
        }

        for (const secret of listResponse.SecretList) {
            try {
                const getCommand = new GetSecretValueCommand({ SecretId: secret.Name });
                const getResponse = await secretsClient.send(getCommand);
                if (getResponse.SecretString) {
                    tenantSecrets[secret.Name] = getResponse.SecretString;
                    console.log(`Loaded secret: ${secret.Name}`);
                }
            } catch (error) {
                console.error(`Failed to load secret ${secret.Name}:`, error.message);
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
            })
        );

        if (secretResponse.SecretString) {
            tenantSecrets[tenant] = JSON.parse(secretResponse.SecretString);
        }
    } catch (error) {
        console.error(`Failed to fetch secrets for tenant ${tenant}:`, error);
        throw error;
    }
}

// Function to get secrets for a tenant
export function getTenantSecrets(tenant: string): any {
    return tenantSecrets[tenant];
}
