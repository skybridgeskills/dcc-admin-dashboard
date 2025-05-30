import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import CredentialsTemplatesCollection from './collections/CredentialTemplates';
import CredentialsBatchesCollection from './collections/CredentialBatches';
import CredentialsCollection from './collections/Credentials';
import EmailTemplatesCollection from './collections/EmailTemplates';
//components
import { Logo } from './components/Logo';
import { Icon } from './components/Icon';
import SideNav from './components/SideNav/SideNav';

//endpoints
import { readPayloadVersion } from './endpoints/readPayloadVersion';
import { getClaimConfig } from './endpoints/getClaimConfig'
import { createBatchCredentials } from './endpoints/createCredentialsForBatch';
import { getBatchCredentials } from './endpoints/getBatchCredentials';
import { getBatchFields } from './endpoints/getBatchFields';
import { sendEmail } from './endpoints/sendEmail';
import { getCredential } from './endpoints/getCredential';
import { sendBatchEmail } from './endpoints/sendBatchEmail';
import { getCollectionCount } from './endpoints/getCollectionCount';

import { getCredentialLinks } from './endpoints/getCredentialLinks';
import { forwardExchangeRequest } from './endpoints/exchange';
import { revokeCredential } from './endpoints/revokeCredential';
import DashboardRedirect from './components/DashboardRedirect';
import AccountSettings from './components/AccountSettings';

export default buildConfig({
    serverURL: "",
    cors: '*',
    admin: {
        css: require.resolve('./components/global.scss'),
        user: Users.slug,
        meta: {
            titleSuffix: '- Digital Credentials Consortium',
            favicon: '/assets/tdm-logo.png',
            ogImage: '/assets/tdm-og.png',
        },
        components: {
            Nav: SideNav,
            graphics: {
                Logo,
                Icon,
            },
            views: {
                Dashboard: DashboardRedirect,
                Account: AccountSettings,
            },
        },
        webpack: config => ({
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    [require.resolve('./helpers/jwtHelpers.ts')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./jobs/queue.server.ts')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/getCredential')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/getCredentialLinks')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/exchange')]:
                        require.resolve('./mocks/emptyObject'),
                },
            },
        }),
    },
    collections: [
        Users,
        CredentialsTemplatesCollection,
        CredentialsBatchesCollection,
        CredentialsCollection,
        EmailTemplatesCollection,
    ],
    endpoints: [
        { method: 'post', path: '/send-email', handler: sendEmail },
        { method: 'post', path: '/send-batch-email', handler: sendBatchEmail },
        { method: 'get', path: '/payload-version', handler: readPayloadVersion },
        { method: 'get', path: '/claim-config', handler: getClaimConfig },
        { method: 'post', path: '/get-batch-credentials', handler: getBatchCredentials },
        { method: 'post', path: '/get-batch-fields', handler: getBatchFields },
        { method: 'post', path: '/create-batch-credentials', handler: createBatchCredentials },
        // This is a security hole that needs to go away when we're done testing!!!
        // Commented out to close hole. If you need to generate a link for a cred, just hit the
        // Resend button and check browser logs!
        // { method: 'get', path: '/get-credential-jwt', handler: getCredentialJwt },
        { method: 'get', path: '/get-credential', handler: getCredential },
        { method: 'post', path: '/get-collection-count', handler: getCollectionCount },
        { method: 'get', path: '/get-credential-links', handler: getCredentialLinks },
        { method: 'post', path: '/exchange/:a/:b/:token', handler: forwardExchangeRequest },
        // { method: 'post', path: '/revoke-credential/:id', handler: revokeCredential },
    ],
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    },
    express: {
  		json: {
  			limit: 1024 * 4,
  		}
	}
});
