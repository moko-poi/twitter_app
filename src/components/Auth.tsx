import React, { useState } from "react";
import styles from './Auth.module.css';
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CameraIcon from '@material-ui/icons/Camera';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { IconButton } from "@material-ui/core";


// function getModalStyle() {
//     const top = 50;
//     const left = 50;
//
//     return {
//         top: `${top}%`,
//         left: `${left}%`,
//         transform: `translate(-${top}%, -${left}%)`,
//     };
// }

const theme = createTheme();

const Auth: React.FC = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [avatarImage, setAvatarImage] = useState<File | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    // const [openModal, setOpenModal] = React.useState(false);
    // const [resetEmail, setResetEmail] = useState("");

    // const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    //     await auth
    //         .sendPasswordResetEmail(resetEmail)
    //         .then(() => {
    //             setOpenModal(false);
    //             setResetEmail("");
    //         })
    //         .catch((err) => {
    //             alert(err.message);
    //             setResetEmail("");
    //         });
    // };

    const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files![0]) {
            setAvatarImage(e.target.files![0]);
            e.target.value = ''
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    const signInEmail = async () => {
        await auth.signInWithEmailAndPassword(email, password);
    };

    const signUpEmail = async () => {
        const authUser = await auth.createUserWithEmailAndPassword(email, password);
        let url = "";
        if (avatarImage) {
            const S =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const N = 16;
            const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
                .map((n) => S[n % S.length])
                .join("");
            const fileName = randomChar + "_" + avatarImage.name;

            await storage.ref(`avatars/${fileName}`).put(avatarImage);
            url = await storage.ref("avatars").child(fileName).getDownloadURL();
        }
        await authUser.user?.updateProfile({
            displayName: username,
            photoURL: url,
        });
        dispatch(
            updateUserProfile({
                displayName: username,
                photoUrl: url,
            })
        );
    };

    const signInGoogle = async () => {
        await auth.signInWithPopup(provider).catch((err) => alert(err.message));
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1593642633279-1796119d5482?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2134&q=80)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {isLogin ? "Login" : "Register"}
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            {!isLogin && (
                                <>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        autoFocus
                                        value={username}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setUsername(e.target.value);
                                        }}
                                    />
                                    <Box textAlign="center">
                                        <IconButton>
                                            <label>
                                                <AccountCircleIcon
                                                    fontSize="large"
                                                    className={
                                                        avatarImage
                                                            ? styles.login_addIconLoaded
                                                            : styles.login_addIcon
                                                    }
                                                />
                                                <input
                                                    className={styles.login_hiddenIcon}
                                                    type="file"
                                                    onChange={onChangeImageHandler}
                                                />
                                            </label>
                                        </IconButton>
                                    </Box>
                                </>
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <Button
                                disabled={
                                    isLogin
                                        ? !email || password.length < 6
                                        : !username || !email || password.length < 6 || !avatarImage
                                }
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                startIcon={<EmailIcon />}
                                onClick={
                                    isLogin
                                        ? async () => {
                                            try {
                                                await signInEmail();
                                            } catch (err) {
                                                alert(err.message);
                                            }
                                        }
                                        : async  () => {
                                            try {
                                                await signUpEmail();
                                            } catch (err) {
                                                alert(err.message);
                                            }
                                        }
                                }
                            >
                                {isLogin ? "Login" : "Register"}
                            </Button>
                            <Grid container>
                                {/*<Grid item xs>*/}
                                {/*    <span*/}
                                {/*        className={styles.login_reset}*/}
                                {/*        onClick={() => setOpenModal(true)}*/}
                                {/*    >*/}
                                {/*        Forgot password?</span>*/}
                                {/*</Grid>*/}
                                <Grid item>
                                    <span
                                        className={styles.login_toggleMode}
                                        onClick={() => setIsLogin(!isLogin)}
                                    >
                                        {isLogin ? "Create new account ?" : "Back to login"}
                                    </span>
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                startIcon={<CameraIcon />}
                                onClick={signInGoogle}
                            >
                                SignIn with Google
                            </Button>
                        </Box>
                    </Box>
                    {/*<Modal open={openModal} onClose={() => setOpenModal(false)}>*/}
                    {/*    <div style={getModalStyle()}>*/}
                    {/*        <div className={styles.login_modal}>*/}
                    {/*            <TextField*/}
                    {/*                InputLabelProps={{*/}
                    {/*                    shrink: true,*/}
                    {/*                }}*/}
                    {/*                type="email"*/}
                    {/*                name="email"*/}
                    {/*                label="Reset E-mail"*/}
                    {/*                value={resetEmail}*/}
                    {/*                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {*/}
                    {/*                    setResetEmail(e.target.value);*/}
                    {/*                }}*/}
                    {/*            />*/}
                    {/*            <IconButton onClick={sendResetEmail}>*/}
                    {/*                <SendIcon />*/}
                    {/*            </IconButton>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</Modal>*/}
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Auth;