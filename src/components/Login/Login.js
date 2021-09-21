import React, { useContext, useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { userContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}
const googleProvider = new firebase.auth.GoogleAuthProvider();
const fbProvider = new firebase.auth.FacebookAuthProvider();


const Login = () => {
    const classes = useStyles();
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: '',
        success: false
    });
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    const handleSignedIn = () => {
        firebase.auth().signInWithPopup(googleProvider)
            .then(result => {
                const { displayName, email, photoURL } = result.user;
                const userSignedIn = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL

                }
                setUser(userSignedIn);
                setLoggedInUser(userSignedIn);
                history.replace(from);
                console.log(displayName, email, photoURL);
            })
    }
    const handleFbSignedIn = () => {
        firebase
            .auth()
            .signInWithPopup(fbProvider)
            .then(result => {
                var user = result.user;
                console.log(user);
            })
            .catch(error => {
                console.log(error);
            });
    }
    const handleSignedOut = () => {
        firebase.auth().signOut()
            .then(result => {
                const userSignedOut = {
                    isSignedIn: false,
                    name: '',
                    email: '',
                    photo: ''
                }
                setUser(userSignedOut);

            })
            .catch(error => {
                console.log(error);
            })
    }
    const handleBlur = (event) => {
        let isFieldValid = true;
        if (event.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);

        }
        if (event.target.name === 'password') {
            const isPasswordValid = event.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(event.target.value);
            isFieldValid = isPasswordValid && passwordHasNumber;
        }
        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[event.target.name] = event.target.value;
            setUser(newUserInfo);
        }
    }
    const handleSubmit = (event) => {
        if (newUser && user.email && user.password) {
            return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(result => {
                    const newUserInfo = { ...user };
                    newUserInfo.success = true;
                    newUserInfo.error = '';
                    setUser(newUserInfo);
                    updateUserInfo(user.name);
                    return newUserInfo;
                })
                .catch(error => {
                    const newUserInfo = { ...user };
                    newUserInfo.success = false;
                    newUserInfo.error = error.message;
                    setUser(newUserInfo);
                });
        }
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(result => {
                    const newUserInfo = { ...user };
                    newUserInfo.success = true;
                    newUserInfo.error = '';
                    setUser(newUserInfo);
                    setLoggedInUser(newUserInfo);
                    history.replace(from);
                    console.log(result.user);
                })
                .catch(error => {
                    const newUserInfo = { ...user };
                    newUserInfo.success = false;
                    newUserInfo.error = error.message;
                    setUser(newUserInfo);
                });
        }
        event.preventDefault();
    }

    const updateUserInfo = name => {
        const user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name,
        }).then(() => {
            console.log('User information update successfully');
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <div style={{ textAlign: 'center' }}>
            {user.isSignedIn ? <Button onClick={handleSignedOut} variant="contained" color="primary">
                Sign Out
            </Button>
                :
                <Button onClick={handleSignedIn} variant="contained" color="primary">
                    Sign in using google
            </Button>}
            <br />
            <br />
            <Button onClick={handleFbSignedIn} variant="contained" color="primary">
                Sign in using Facebook
            </Button>
            {
                user.isSignedIn && <div>
                    <p>Name:{user.name}</p>
                    <p>Email:{user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            }
            <br />
            <br />
            <input type="checkbox" name="newUser" id="" onClick={() => setNewUser(!newUser)} />
            <label htmlFor="newUser"> New user sign up</label>
            <form onSubmit={handleSubmit}>
                {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Enter your name" />
                }                <br />
                <input type="text" name="email" onBlur={handleBlur} placeholder="Enter your email" required />
                <br />
                <input type="password" name="password" onBlur={handleBlur} id="" placeholder="Enter your password" required />
                <br />
                <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
            </form>
            <p style={{ color: 'red' }}>{user.error}</p>
            {user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'LoggedIn'} Successfully</p>}
        </div>
    );
};
export default Login;