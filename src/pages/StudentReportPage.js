import { useState } from "react";
import dayjs from "dayjs";
import faker from "faker";
import { Line, Radar } from "react-chartjs-2";
import { Dropdown, Form, Segment } from "semantic-ui-react";
import useSelectedStudent from "../hooks/useSelectedStudent";
import state from "../state";
import MasterPage from "./MasterPage";

const scales = new Array(20).fill(0).map((_, index) => ({
  id: index,
  name: "Scale " + (index + 1),
  color: faker.vehicle.color(),
  data: state.surveys.map(() => parseFloat((Math.random() * 5).toFixed(1))),
}));

const StudentReportPage = () => {
  const student = useSelectedStudent();
  const [selectedScales, setSelectedScales] = useState(
    scales.slice(0, 5).map((x) => x.id)
  );

  function handleSelectedScalesChange(e, { value }) {
    setSelectedScales(value);
  }

  return (
    <MasterPage header={student.name}>
      <Form>
        <Form.Field>
          <label>Scales</label>
          <Dropdown
            fluid
            selection
            multiple={true}
            options={scales.map((scale) => ({
              icon: (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: scale.color,
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginRight: 5,
                  }}
                />
              ),
              value: scale.id,
              text: scale.name,
            }))}
            value={selectedScales}
            closeOnChange
            onChange={handleSelectedScalesChange}
          />
        </Form.Field>
        <Form.Field>
          <Radar
            data={{
              labels: selectedScales.map((index) => scales[index].name),
              datasets: [
                {
                  fill: false,
                  borderColor: "blue",
                  label: "",
                  data: selectedScales.map((index) =>
                    (
                      scales[index].data.reduce((sum, value) => sum + value) /
                      state.surveys.length
                    ).toFixed(1)
                  ),
                },
              ],
            }}
            options={{ responsive: true, legend: { display: false } }}
          />
        </Form.Field>
        <Form.Field>
          <Line
            data={{
              labels: state.surveys.map((survey) =>
                dayjs(survey.end).format("YY/MM/DD")
              ),
              datasets: selectedScales.map((index) => {
                const scale = scales[index];
                return {
                  label: scale.name,
                  borderColor: scale.color,
                  backgroundColor: scale.color,
                  fill: false,
                  data: scale.data,
                };
              }),
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
            height={400}
          />
        </Form.Field>
      </Form>
    </MasterPage>
  );
};

export default StudentReportPage;
