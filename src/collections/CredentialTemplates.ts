import { CollectionConfig } from 'payload/types';
import CreateTemplate from '../components/template/CreateTemplate';
import TemplatePageDescription from '../components/template/TemplatePageDescription';
import CodeEditorWithCsvValidation from '../components/template/CodeEditorWithCsvValidation';
import { tenantAccessFilterQuery, setTenantOnCreate } from '../helpers/tenant';

const CredentialsTemplatesCollection: CollectionConfig = {
    slug: 'credential-template',
    admin: {
        defaultColumns: ['title', 'id'],
        useAsTitle: 'title',
        description: TemplatePageDescription,
        components: {
            views: {
                Edit: CreateTemplate,
            },
        },
    },
    access: { read: tenantAccessFilterQuery },
    hooks: { beforeChange: [setTenantOnCreate] },
    fields: [
        { name: 'tenant', type: 'text', hidden: true },
        {
            name: 'title',
            type: 'text',
            required: true,
            minLength: 3,
            maxLength: 100,
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
            maxLength: 1000,
        },
        {
            name: 'internalNotes',
            type: 'textarea',
            required: false,
            maxLength: 1000,
        },
        {
            name: 'credentialTemplateJson', // required
            type: 'json', // required
            //  defaultValue: JSON.stringify(placeHolderVc),
            admin: {
                description:
                    'Write a credential template using Handlebars syntax that will be used to create credentials.',
                components: { Field: CodeEditorWithCsvValidation },
            },
            required: true,
        },
    ],
};

export default CredentialsTemplatesCollection;
