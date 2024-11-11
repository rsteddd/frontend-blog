import React, {useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthRegister, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Avatar } from "@mui/material";
import styles from "./Registration.module.scss";
import axios from "../../axios";

export const Registration = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const [avatarUrl, setAvatarUrl] = useState("");
    const inputFileRef = useRef(null);


    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            avatarUrl:"",
            fullName: "Івасик телесик",
            email: "test@test2.com",
            password: "test2",
        },
        mode: "onChange",
    });

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append("image", file);
            const { data } = await axios.post("upload/avatar", formData);  // Без перевірки токена тут
            setAvatarUrl(data.url);
            console.log(avatarUrl)
        } catch (err) {
            console.warn(err);
            alert("помилка при завантаженні файлу");
        }
    };

    const onSubmit = async (values) => {
        const formData = { ...values, avatarUrl: avatarUrl }; // Додаємо avatarUrl до значень

        const data = await dispatch(fetchAuthRegister(formData));

        if (!data.payload) {
            return alert("Не можливо зареєструватися");
        }
        if ("token" in data.payload) {
            window.localStorage.setItem("token", data.payload.token);
        }
    };

    if (isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper className={styles.root}>
            <Typography className={styles.title} variant="h5">
                Створити Аккаунт
            </Typography>
            <div className={styles.avatar}>
                <Avatar   src={`http://localhost:4444${avatarUrl}`} onClick={() => inputFileRef.current.click()}  sx={{ width: 100, height: 100 }} >
                        <input ref={inputFileRef} type="file"
                               onChange={handleChangeFile}
                               hidden/>
                </Avatar>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="Повне ім'я"
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
                    {...register("fullName", { required: "Вкажіть ім'я" })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register("email", { required: "Вкажіть пошту" })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register("password", { required: "Вкажіть пароль" })}
                    fullWidth
                />
                <Button
                    disabled={!isValid}
                    type="submit"
                    size="large"
                    variant="contained"
                    fullWidth
                    className={styles.button}
                >
                    Зареєструватися
                </Button>
            </form>
        </Paper>
    );
};
