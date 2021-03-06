"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import { browserHistory } from "react-router";
import LoginForm from "./components/loginform";
import ErrorMessage from "./components/errormessage";
import SuccessMessage from "./components/successmessage";

class Login extends React.Component {
  constructor() {
    super();
    this.state = { email: "", password: "", errors: [], success: [] }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleError = this.handleError.bind(this);
  }
  handleEmailChange(value) {
    this.setState({ email: value });
  }
  handlePasswordChange(value) {
    this.setState({ password: value });
  }
  handleLogin() {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin",
      body: `email=${ this.state.email }&password=${ this.state.password }`
    }).then((response) => response.json())
      .then((json) => {
        if (json.token) {
          this.props.onAuth(json.token);
          browserHistory.push("/browse");
        } else {
          this.setState({ email: "", password: "", errors: json.error || [], success: json.success || [] });
        }
      });
  }
  handleError(value) {
    this.setState({ errors: value || [] });
  }
  render() {
    return (
      <div className="login-container">
        <h1>Sign In</h1>
        <LoginForm
        onSubmit={ this.handleLogin }
        onEmailChange={ this.handleEmailChange }
        onPasswordChange={ this.handlePasswordChange }
        onError={ this.handleError }
        email={ this.state.email }
        password={ this.state.password } />
        <ErrorMessage errors={ this.state.errors } />
        <SuccessMessage success={ this.state.success } />
      </div>
    );
  }
}

export default Login
