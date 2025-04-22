import { CollectionConfig } from 'payload/types';
import UserPageDescription from '../components/User/UserPageDescription';
import CreateUser from '../components/User/CreateUser';
import { tenantAccessFilterQuery, setTenantOnCreate } from '../helpers/tenant';

const isAdmin = ({ req }) => req.user.isAdmin;

const Users: CollectionConfig = {
  slug: 'users',
  auth: { tokenExpiration: 7 * 24 * 60 * 60 },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
    description: UserPageDescription,
    components: { views: { Edit: CreateUser } },
  },
  access: {
    read: ({ req }) => ({ tenant: { equals: req.headers.host } }),
    create: (args) => isAdmin(args) ?
      tenantAccessFilterQuery(args) : false,
    update: (args) => isAdmin(args) ?
      tenantAccessFilterQuery(args) : false,
    delete: (args) => isAdmin(args) ?
      tenantAccessFilterQuery(args) : false,
  },
  hooks: { beforeChange: [setTenantOnCreate] },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'isAdmin',
      label: 'Is admin for all tenants',
      type: 'checkbox',
      defaultValue: false,
      saveToJWT: true,
      access: {
        create: isAdmin,
        update: isAdmin,
        read: isAdmin,
      },
    },
    {
      name: 'tenant',
      hidden: true,
      type: 'text',
      saveToJWT: true,
      access: {
        create: isAdmin,
        update: isAdmin,
        read: isAdmin,
      },
    },

  ],
};


export default Users;
