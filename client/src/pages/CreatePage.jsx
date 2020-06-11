import React, {useContext, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";

/**
 * this is page for generate new short link
 * @return {JSX}
 * @constructor
 */
export const CreatePage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const message = useMessage();
    const refError = useRef();
    const {request} = useHttp();
    const [link, setLink] = useState('');

    /**
     * this function make request to server for generate short link
     * @param {KeyboardEvent} event
     * @returns {Promise<void>}
     */
    const pressHandler = async event => {
        if (!(link.indexOf('http://') >= 0) || !(link.indexOf('https://') >= 0)) {
            console.log(refError.current.style.display);
            refError.current.style.display = "block";
        } else {
            refError.current.style.display = "none";
            if (event.key === 'Enter') {
                try {
                    const data = await request('/api/link/generate', 'POST', {from: link}, {
                        authorization: `Bearer ${auth.token}`
                    });
                    console.log(data);
                    if (data.error) {
                        message(data.message);
                    }
                    history.push(`/detail/${data.link._id}`);
                }
                catch (e) {}
            }
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                    <div className="input-field">
                        <input
                            placeholder="Вставьте ссылку"
                            id="link"
                            type="text"
                            onChange={e => setLink(e.target.value)}
                            onKeyPress={pressHandler}
                        />
                        <label htmlFor="link">Введите ссылку</label>
                    </div>
                    <div className="error" ref={refError} style={{display: 'none', color: "red"}}>
                        Данная ссылка не корректна
                    </div>
                </div>
            </div>
        </div>
    )
};
