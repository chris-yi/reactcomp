import React, {Component} from 'react';

export default class Login extends Component {

  render() {
    return (
      <div>
        <a href="http://localhost:8080/auth/callback">
          <button>
            Login
          </button>
        </a>
      </div>
    );
  }
}
