import { Form, Button } from "semantic-ui-react";
import { FormEvent, useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { AuthContext, UserData } from "../../context/auth.context";

const initialFormValues = {
  username: "",
  password: "",
};

type FormErrors = {
  username?: String;
  password?: String;
} | null;

function Login() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState<FormErrors>();
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const [loginUser, { loading }] = useMutation(LOGIN, {
    update(_, result) {
      const {
        data: { login: userData },
      } = result;
      setCurrentUser(userData);
      navigate("/");
    },
    onError(err) {
      console.log(err);
      setErrors(err.graphQLErrors[0].extensions.errors as FormErrors);
    },
    variables: formValues,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Sign In</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          error={errors?.username ? true : false}
          type="text"
          onChange={handleInputChange}
          value={formValues.username}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          error={errors?.password ? true : false}
          onChange={handleInputChange}
          value={formValues.password}
        />
        <Button type="submit" primary>
          Sign In
        </Button>
      </Form>
      {errors && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value, i) => (
              <li key={i}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
