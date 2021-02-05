import dayjs from "dayjs";
import React from "react";
import { Button, Table } from "semantic-ui-react";
import ResponseSurveyAction from "../actions/ResponseSurveyAction";
import ViewStudentReportAction from "../actions/ViewStudentReportAction";
import useSurveys from "../hooks/useSurveys";
import useUser from "../hooks/useUser";
import { STUDENT } from "../roles";
import MasterPage from "./MasterPage";

const SurveyListPage = () => {
  const user = useUser();
  const isStudent = user.role === STUDENT;
  const surveys = useSurveys();

  return (
    <MasterPage header={user.role !== STUDENT ? "Report" : "Surveys"}>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Start Date</Table.HeaderCell>
            <Table.HeaderCell>End Date</Table.HeaderCell>
            {!isStudent && <Table.HeaderCell>Responses</Table.HeaderCell>}
            {isStudent && <Table.HeaderCell>Status</Table.HeaderCell>}
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {surveys.map((survey) => (
            <Table.Row key={survey.id}>
              <Table.Cell>
                {dayjs(survey.start).format("MM/DD/YYYY")}
              </Table.Cell>
              <Table.Cell>{dayjs(survey.end).format("MM/DD/YYYY")}</Table.Cell>
              {!isStudent && <Table.Cell>{survey.responses}</Table.Cell>}
              {isStudent && (
                <Table.Cell>{survey.finished ? "Finished" : "New"}</Table.Cell>
              )}
              <Table.Cell>
                {isStudent && (
                  <Button
                    disabled={!survey.finished}
                    onClick={() => ResponseSurveyAction(survey.id)}
                  >
                    Response
                  </Button>
                )}
                {!isStudent && (
                  <Button onClick={() => ViewStudentReportAction()}>
                    Details
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </MasterPage>
  );
};

export default SurveyListPage;
