import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
    const { id } = useParams();
    const isAuth = useSelector(selectIsAuth);
    const navigate = useNavigate();
    const [text, setText] = React.useState("");
    const [isLoading, setLoading] = useState(false);
    const [title, setTitle] = React.useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [tags, setTags] = useState("");
    const inputFileRef = useRef(null);

    const isEditing = Boolean(id);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append("image", file);
            const { data } = await axios.post("upload", formData);
            setImageUrl(data.url);
        } catch (err) {
            console.warn(err);
            alert("помилка при завантаженні файлу");
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl("");
    };

    const onChange = React.useCallback((value) => {
        setText(value);
    }, []);
    const onSubmit = async () => {
        try {
            setLoading(true);
            const fields = {
                title,
                imageUrl,
                tags,
                text
            };

            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post("/posts", fields);

            const _id = isEditing ? id : data._id;
            navigate(`/posts/${_id}`);
        } catch (err) {
            console.warn(err);
            alert("не вдалось завантажити статтю");
        }
    };

    useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setText(data.text);
                    setImageUrl(data.imageUrl);
                    setTags(data.tags.join(","));
                })
                .catch((err) => {
                    console.warn(err);
                    alert("не вдалось отримати статтю");
                });
        }
    }, [id]);

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: "400px",
            autofocus: true,
            placeholder: "Введіть текст...",
            status: false,
            autosave: {
                enabled: true,
                delay: 1000
            }
        }),
        []
    );

    if (!window.localStorage.getItem("token") && !isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper style={{ padding: 30 }}>
            <Button
                onClick={() => inputFileRef.current.click()}
                variant="outlined"
                size="large"
                className={styles.uploadButton}
            >
                Завантажити превю
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
            {imageUrl && (
                <div className={styles.uploadPreview}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onClickRemoveImage}
                        className={styles.removeButton}
                    >
                        Видалити
                    </Button>
                    <img
                        className={styles.image}
                        src={`http://localhost:4444${imageUrl}`}
                        alt="Uploaded"
                    />
                </div>
            )}
            <TextField
                classes={{ root: styles.title }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="standard"
                placeholder="Заголовок..."
                fullWidth
            />
            <TextField
                classes={{ root: styles.tags }}
                variant="standard"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Теги"
                fullWidth
            />
            <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {isEditing ? "Зберегти" : "Опублікувати"}
                </Button>
                <a href="/">
                    <Button size="large">Відмінити</Button>
                </a>
            </div>
        </Paper>
    );
};
