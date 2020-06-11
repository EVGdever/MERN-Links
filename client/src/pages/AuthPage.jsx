import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";

/**
 * this is page for authentication user
 * @return {JSX}
 * @constructor
 */
export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
       window.M.updateTextFields();
    });

    /**
     * this function set value of input to state
     * @param {KeyboardEvent} event
     */
    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    };

    /**
     * this is async function send request to server for register user and post data
     * @example
     * data = {
     *     password: PaSsWoRd123123,
     *     email: example@gmail.com,
     * }
     */
    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form});
            message(data.message);
        } catch (e) {}
    };

    /**
     * this is async function send request to server for register user and post data
     * @param {Object} formDate this date will be get from form's inputs
     * @return {loginData}
     * @example
     * request{
     *     password: PaSsWoRd123123,
     *     email: example@gmail.com,
     * }
     */
    const loginHandler = async (formDate) => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form});
            auth.login(data.token, data.userId);
        } catch (e) {}
    };

    return (
        <div className="row">
            <div className="col 6s offset-s3">
                <h1>Сокращение ссылок</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>

                            <div className="input-field">
                                <input
                                    placeholder="Введите email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="yellow-input"
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                                    <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input
                                    placeholder="Введите пароль"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                    <label htmlFor="password">Пароль</label>
                            </div>

                        </div>
                    </div>
                    <div className="card-action">

                        <button
                            className="btn yellow darken-4"
                            style={{marginRight: 20}}
                            disabled={loading}
                            onClick={loginHandler}
                        >Войти</button>

                        <button
                            className="btn gray lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >Регистрация</button>

                    </div>
                </div>
            </div>
        </div>
    )
};

/**
 * @typedef {Object} loginData
 * @property {string} jwtToken
 * @property {number} userId
 */
