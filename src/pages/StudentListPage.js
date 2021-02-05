import React, { useState } from "react";
import { Button, Icon, Menu, Table } from "semantic-ui-react";
import ToggleSubscribingAction from "../actions/ToggleSubscribingAction";
import ViewStudentReportAction from "../actions/ViewStudentReportAction";
import useStudents from "../hooks/useStudents";
import useUser from "../hooks/useUser";
import { LEADER } from "../roles";
import MasterPage from "./MasterPage";

const StudentListPage = () => {
  const user = useUser();
  const students = useStudents();
  const pageCount = Math.ceil(students.length / 20);
  const [page, setPage] = useState(0);
  const visibleStudents = students.slice(page * 20, (page + 1) * 20);

  return (
    <MasterPage header="Students">
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>UniLogin</Table.HeaderCell>
            <Table.HeaderCell>FullName</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Class</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {visibleStudents.map((student) => (
            <Table.Row key={student.id}>
              <Table.Cell>{student.uniId}</Table.Cell>
              <Table.Cell>{student.name}</Table.Cell>
              <Table.Cell>{student.email}</Table.Cell>
              <Table.Cell>{student.klass}</Table.Cell>
              <Table.Cell>
                {student.unsubscribed ? "Unsubscribed" : "Subscribing"}
              </Table.Cell>
              <Table.Cell>
                <Button onClick={() => ViewStudentReportAction(student.id)}>
                  Stats
                </Button>
                {user.role === LEADER && (
                  <Button style={{ width: 110 }} onClick={() => ToggleSubscribingAction(student.id)}>
                    {student.unsubscribed ? "Subscribe" : "Unsubscribe"}
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="6">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Menu pagination>
                  <Menu.Item
                    disabled={!page}
                    as="a"
                    icon
                    onClick={() => setPage(page - 1)}
                  >
                    <Icon name="chevron left" />
                  </Menu.Item>
                  {new Array(pageCount).fill(0).map((_, index) => (
                    <Menu.Item
                      as="a"
                      onClick={() => setPage(index)}
                      style={{ fontWeight: index === page ? "bold" : "normal" }}
                    >
                      {index + 1}
                    </Menu.Item>
                  ))}
                  <Menu.Item
                    disabled={page >= pageCount - 1}
                    as="a"
                    icon
                    onClick={() => setPage(page + 1)}
                  >
                    <Icon name="chevron right" />
                  </Menu.Item>
                </Menu>
              </div>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </MasterPage>
  );
};

export default StudentListPage;
