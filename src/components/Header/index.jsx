import React from "react";
import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectIsAuth, logout} from "../../redux/slices/auth";


export const Header = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();


    const onClickLogout = () => {
        if (window.confirm("Ви хочете вийти?")) {
            dispatch(logout());
            window.localStorage.removeItem('token',)
        }
    };

    return (
        <div className={styles.root}>
            <Container maxWidth="lg">
                <div className={styles.inner}>
                    <Link className={styles.logo} to="/">
                        <div>BLOG</div>
                    </Link>
                    <div className={styles.buttons}>
                        {isAuth ? (
                            <>
                                <Link to="/add-post">
                                    <Button variant="contained">Написати
                                        статтю </Button>
                                </Link>
                                <Button onClick={onClickLogout}
                                        variant="contained" color="error">
                                    Вийти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outlined">Увійти</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="contained">Створити
                                        аккаунт</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};
