import { Form, Button } from "semantic-ui-react";
import { FormEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext, UserData } from "../../context/auth.context";

import "./styles.css";

const initialFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
} | null;

function Register() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState<FormErrors>();
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const [createUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      setCurrentUser(userData);
      navigate("/home");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors as any);
    },
    variables: formValues,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser();
  };

  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email..."
          name="email"
          type="email"
          error={errors?.email ? true : false}
          onChange={handleInputChange}
          value={formValues.email}
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
        <Form.Input
          label="Confirm Password"
          placeholder="confirm Password..."
          name="confirmPassword"
          type="password"
          error={errors?.confirmPassword ? true : false}
          onChange={handleInputChange}
          value={formValues.confirmPassword}
        />
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
