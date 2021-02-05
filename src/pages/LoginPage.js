import { Button, Grid, Header, Segment } from "semantic-ui-react";
import LoginAction from "../actions/LoginAction";
import users from "../users";

const LoginPage = () => (
  <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as="h2" color="teal" textAlign="center">
        UVM - Log-in to your account
      </Header>
      <Segment.Group>
        <Segment basic>
          <Button
            color="teal"
            fluid
            size="large"
            onClick={() => LoginAction(users.student)}
          >
            Login in as student
          </Button>
        </Segment>
        <Segment basic>
          <Button
            color="teal"
            fluid
            size="large"
            onClick={() => LoginAction(users.teacher)}
          >
            Login in as teacher
          </Button>
        </Segment>
        <Segment basic>
          <Button
            color="teal"
            fluid
            size="large"
            onClick={() => LoginAction(users.leader)}
          >
            Login in as leader
          </Button>
        </Segment>
      </Segment.Group>
    </Grid.Column>
  </Grid>
);

export default LoginPage;
