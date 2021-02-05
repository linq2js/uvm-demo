import {
  Divider,
  Dropdown,
  Header,
  List,
  Menu,
  Segment,
} from "semantic-ui-react";
import LogoutAction from "../actions/LogoutAction";
import NavigateAction from "../actions/NavigateAction";
import useUser from "../hooks/useUser";
import { LEADER, STUDENT, TEACHER } from "../roles";

const DashboardItem = (
  <Dropdown.Item onClick={() => NavigateAction("dashboard")}>
    Dashboard
  </Dropdown.Item>
);

const StudentListItem = (
  <Dropdown.Item onClick={() => NavigateAction("studentList")}>
    Students
  </Dropdown.Item>
);

const ReportItem = (
  <Dropdown.Item onClick={() => NavigateAction("surveyList")}>
    Report
  </Dropdown.Item>
);

const SurveyListItem = (
  <Dropdown.Item onClick={() => NavigateAction("surveyList")}>
    Surveys
  </Dropdown.Item>
);

const menu = {
  [TEACHER]: (
    <>
      {DashboardItem}
      {StudentListItem}
      {ReportItem}
    </>
  ),
  [LEADER]: (
    <>
      {DashboardItem}
      {StudentListItem}
      {ReportItem}
    </>
  ),
  [STUDENT]: (
    <>
      {DashboardItem}
      {SurveyListItem}
    </>
  ),
};

const MasterPage = ({ header, footer, children }) => {
  const user = useUser();
  const menuItems = menu[user.role];
  return (
    <div>
      <Menu fixed="top" inverted>
        <Menu.Item as="a" header>
          UVM
        </Menu.Item>
        <Dropdown item simple text="Pages">
          <Dropdown.Menu>{menuItems}</Dropdown.Menu>
        </Dropdown>
        <Menu.Item header>
          Hi {user.name} ({user.role})
        </Menu.Item>
        <Menu.Item as="a" onClick={LogoutAction}>
          Logout
        </Menu.Item>
      </Menu>

      <div style={{ margin: "20px", marginTop: "5em" }}>
        <Header as="h1">{header}</Header>
        <div>{children}</div>
      </div>

      <Segment inverted vertical style={{ padding: "2em" }}>
        {footer && (
          <>
            {footer}
            <Divider inverted section />
          </>
        )}
        <List horizontal inverted divided link size="small">
          <List.Item as="a" href="#">
            User Guides
          </List.Item>
          <List.Item as="a" href="#">
            Terms and Conditions
          </List.Item>
          <List.Item as="a" href="#">
            Privacy Policy
          </List.Item>
        </List>
      </Segment>
    </div>
  );
};

export default MasterPage;
