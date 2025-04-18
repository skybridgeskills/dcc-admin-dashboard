import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import { CREDENTIAL_STATUS } from '../constants/credentials';

const coordinatorUrl = process.env.COORDINATOR_URL ?? 'http://localhost:4005';
const tenantName = process.env.TENANT_NAME ?? 'test';

export const revokeCredential: PayloadHandler = async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;
    const { reason } = req.body;
    const credentialId = `urn:uuid:${id}`
    try {
        const fetchResponse = await fetch(`${coordinatorUrl}/instance/${tenantName}/credentials/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credentialId,
                credentialStatus: [{ type: 'BitstringStatusListCredential', status: 'revoked' }],
            }),
        });

        if (fetchResponse.status === 200) {
            await payload.update({
                collection: 'credential',
                id,
                data: {
                    status: CREDENTIAL_STATUS.REVOKED,
                    revocationReason: reason,
                    revocationDate: new Date().toISOString(),
                    revokedBy: req.user.id,
                },
            });
        }

        const result = await fetchResponse.json();

        res.status(fetchResponse.status).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
