import React, { useState } from 'react';
import './SideNav.scss';
import { Link, NavLink } from 'react-router-dom';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Logout from '../Logout/Logout';
import Account from '../Account/Account';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';

import Logo from '../../assets/tdm-alt-logo.png';
import ListChecks from '../../assets/list-checks.svg';
import FileCheck from '../../assets/file-check.svg';
import FileEdit from '../../assets/file-edit.svg';
import MailPlus from '../../assets/mail-plus.svg';
import Users from '../../assets/users.svg';

const SideNav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { user } = useAuth();

    const {
        routes: { admin },
    } = useConfig();

    const close = () => {
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={`navbar-wrapper relative ${isOpen ? 'open' : ''}`}>

            {!isOpen && (
                <button
                    onClick={toggleMenu}
                    className="w-10 h-14 openmenu-button absolute top-1/2 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 rounded-r-lg shadow-lg text-center"
                    aria-label="Open menu"
                >
                    <div className="">
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-1 h-2 bg-gray-400 rounded mb-1"></div>
                            <div className="w-1 h-2 bg-gray-400 rounded"></div>
                        </div>
                    </div>
                </button>
            )}

            <header>
                <div className="dark:bg-gray-200 p-4">
                <img className="h-15" src={Logo} alt="Digital Credentials Consortium logo" />
                </div>
                <button
                    onClick={toggleMenu}
                    className="closemenu-button absolute top-4 right-4 w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full shadow-md flex items-center justify-center transition-all"
                    aria-label="Close menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </header>

            <section>
                <NavLink
                    className="navbar-buttons"
                    to="/admin/collections/credential-batch"
                    onClick={close}
                >
                    <img src={ListChecks} alt="credential-batch" />{' '}
                    <span className={`transition-[font-size]`}>Issuance Overview</span>
                </NavLink>

                <NavLink
                    className="navbar-buttons"
                    to="/admin/collections/credential"
                    onClick={close}
                >
                    <img src={FileCheck} alt="credential" />
                    <span className={`transition-[font-size]`}>Credentials</span>
                </NavLink>

                <NavLink
                    className="navbar-buttons"
                    to="/admin/collections/credential-template"
                    onClick={close}
                >
                    <img src={FileEdit} alt="credential-template" />{' '}
                    <span className={`transition-[font-size]`}>Credential Templates</span>
                </NavLink>

                <NavLink
                    className="navbar-buttons"
                    to="/admin/collections/email-template"
                    onClick={close}
                >
                    <img src={MailPlus} alt="email-template" />
                    <span className={`transition-[font-size]`}>Email Templates</span>
                </NavLink>

                <NavLink className="navbar-buttons" to="/admin/collections/users" onClick={close}>
                    <img src={Users} alt="users" />
                    <span className={`transition-[font-size]`}>Users</span>
                </NavLink>
            </section>

            <footer className="flex flex-col gap-8">
                <section>
                    <Link
                        to={`${admin}/account`}
                        className={`flex justify-center transition-[gap] gap-5`}
                        onClick={close}
                    >
                        <Account className="w-15 h-15 border border-slate-50 rounded-full shadow-fours" />
                        <section className="flex flex-col">
                            <p
                                className={`text-start m-0 transition-[font-size] font-inter text-lg font-medium`}
                            >
                                {(user.name as string) || 'Unknown User'}
                            </p>
                            <p className={`text-start text-base m-0 transition-[font-size]`}>
                                {user.email}
                            </p>
                        </section>
                    </Link>
                </section>

                <section>
                    <Logout
                        className={`flex justify-center transition-[gap] gap-2`}
                        textClassName={`text-xl transition-[font-size]`}
                    />
                </section>
            </footer>
        </nav>
    );
};

export default SideNav;
