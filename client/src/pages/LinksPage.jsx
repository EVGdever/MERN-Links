import React, {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {LinkList} from "../components/LinksList";

/**
 * this is page for display list of links
 * @return {JSX}
 * @constructor
 */
export const LinksPage = () => {
    const {request, loading} = useHttp();
    const {token} = useContext(AuthContext);
    const [links, setLinks] = useState([]);

    const fetchLinks = useCallback(async () => {
        try {
            const fetched = await request(`/api/link`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setLinks(fetched);
        } catch (e) {}
    }, [token, request]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && <LinkList links={links}/> }
        </>
    )
};
