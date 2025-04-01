import { CollectionConfig } from 'payload/types';
import UserPageDescription from '../components/User/UserPageDescription';
import CreateUser from '../components/User/CreateUser';
import { isSuperUser } from '../helpers/isSuperUser';

const isSuper = ({ req }) => {
  return isSuperUser(req.user)
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: { tokenExpiration: 7 * 24 * 60 * 60 },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
    description: UserPageDescription,
    components: { views: { Edit: CreateUser } },
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ['super', 'user'],
      saveToJWT: true,
      access: {
        create: isSuper,
        update: isSuper,
        read: isSuper,
      },
    },
    {
      name: 'tenant',
      type: 'text',
      saveToJWT: true,
      access: {
        create: isSuper,
        update: isSuper,
        read: isSuper,
      },
    },

  ],
};


export default Users;
