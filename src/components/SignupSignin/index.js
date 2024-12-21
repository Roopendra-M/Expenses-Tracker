import React, { useState } from "react";
import "./styles.css";
import InputComponent from "../common/Input";
import Button from "../common/Button";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignupSignin = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    cfPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  // Update form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Create user document in Firestore
  const createDoc = async (user, displayName) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(userRef, {
          displayName,
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });
      } catch (error) {
        toast.error("Failed to create user document");
      }
    }
  };

  // Handle sign-up
  const handleSignUp = async () => {
    const { name, email, password, cfPassword } = formState;

    if (!name || !email || !password || !cfPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== cfPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await createDoc(user, name);
      toast.success("Account created successfully");
      setFormState({ name: "", email: "", password: "", cfPassword: "" });
      setIsLogin(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle sign-in
  const handleSignIn = async () => {
    const { email, password } = formState;

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      navigate("/about");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createDoc(user, user.displayName || user.email);
      toast.success("Login successful");
      navigate("/about");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <h2 className="title">
        {isLogin ? "Login to" : "Sign Up on"}{" "}
        <span style={{ color: "#4CAF50" }}>Financely</span>
      </h2>

      {!isLogin && (
        <InputComponent
          type="text"
          name="name"
          value={formState.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
        />
      )}
      <InputComponent
        type="email"
        name="email"
        value={formState.email}
        onChange={handleInputChange}
        placeholder="Enter your email"
      />
      <InputComponent
        type="password"
        name="password"
        value={formState.password}
        onChange={handleInputChange}
        placeholder="Enter your password"
      />
      {!isLogin && (
        <InputComponent
          type="password"
          name="cfPassword"
          value={formState.cfPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
        />
      )}

      <Button
        text={loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        disabled={loading}
        onClick={isLogin ? handleSignIn : handleSignUp}
        purple
      />

      <p className="or-name">or</p>

      <Button
        text={loading ? "Loading..." : `${isLogin ? "Login" : "Sign Up"} with Google`}
        onClick={handleGoogleAuth}
        purple={false}
        icon={<FcGoogle className="FcGoogle" />}
      />

      <p className="have-an-account">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{ cursor: "pointer" }}
        >
          Click here
        </span>
      </p>
    </div>
  );
};

export default SignupSignin;
