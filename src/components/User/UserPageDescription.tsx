import React from 'react';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import { Link } from 'react-router-dom';
import './UserPageDescription.scss';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';

const UserPageDescription: React.FC = () => {
    const {
        routes: { admin: adminRoute },
    } = useConfig();

    const { user } = useAuth()

    return user.isAdmin ? (
        <div className="header_wrapper">
            <p className="header_paragraph"></p>
            <Link className="header_template_button" to={`${adminRoute}/collections/users/create`}>
                <img className="plus_icon" src="/assets/plus-icon.svg" alt="plus icon" />
                Create New User
            </Link>
        </div>
    ) : null;
};

export default UserPageDescription;
