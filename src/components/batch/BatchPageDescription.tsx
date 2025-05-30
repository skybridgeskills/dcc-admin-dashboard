import React, { useState, useEffect } from 'react';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import { NavLink } from 'react-router-dom';
import { totalSentBatchesQuery } from '../../constants/countQueries';

const BatchPageDescription: React.FC = () => {
    const {
        routes: { admin: adminRoute },
    } = useConfig();

    const [count, setCount] = useState<number | undefined>(0);

    const fetchBatchCredentials = async (page = 1) => {
        const res = await fetch('/api/get-collection-count', {
            method: 'POST',
            body: JSON.stringify({
                collectionName: 'credential-batch',
                query: totalSentBatchesQuery,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (res.status === 200) {
            const data = await res.json();

            setCount(data?.count);
        }
    };

    useEffect(() => {
        fetchBatchCredentials();
    }, []);

    return (
        <div>
            <div className="header_wrapper">
                <p className="header_paragraph">
                    <span className="header_number">{count}</span> Issued Batches
                </p>
                <NavLink
                    className="header_button"
                    activeClassName="active"
                    to={`${adminRoute}/collections/credential-batch/create`}
                >
                    <img className="header_plus_icon" src="/assets/plus-icon.svg" alt="plus icon" />
                    Upload and Prepare Batch
                </NavLink>
            </div>
        </div>
    );
};

export default BatchPageDescription;
