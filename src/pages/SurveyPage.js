import { useState } from "react";
import { Button, Checkbox, Header, Segment } from "semantic-ui-react";
import NavigateAction from "../actions/NavigateAction";
import MasterPage from "./MasterPage";

const questions = [
  "Er du glad for din skole?",
  "Er du glad for din klasse?",
  "Jeg prøver at forstå mine venner, når de er triste eller sure.",
  "Jeg er god til at arbejde sammen med andre.",
  "Jeg siger min mening, når jeg synes, at noget er uretfærdigt.",
  "Hvor tit kan du finde en løsning på problemer, bare du prøver hårdt nok?",
  "Hvor tit kan du klare det, du sætter dig for?",
  "Kan du koncentrere dig i timerne?",
  "Føler du dig ensom?",
  "Hvor tit har du ondt i maven?",
];
const answerTypes = [
  "Meget tit",
  "Tit",
  "En gang imellem",
  "Sjældent",
  "Aldrig",
  "Jeg ønsker ikke at svare",
];
const SurveyPage = () => {
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);

  function changeAnswer(value) {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  }

  return (
    <MasterPage header={`Question ${index + 1}/10`}>
      <Segment>
        <Header>{questions[index]}</Header>
      </Segment>
      {answerTypes.map((answerType, answer) => (
        <Segment key={answer}>
          <Checkbox
            checked={answers[index] === answer}
            onChange={() => changeAnswer(answer)}
            label={answerType}
          />{" "}
        </Segment>
      ))}
      <Segment style={{ textAlign: "center" }}>
        <Button
          style={{ width: 100 }}
          disabled={!index}
          onClick={() => setIndex(index - 1)}
        >
          Previous
        </Button>
        {index >= questions.length - 1 ? (
          <Button
            style={{ width: 100 }}
            disabled={typeof answers[index] === "undefined"}
            onClick={() => NavigateAction("surveyList")}
          >
            Finish
          </Button>
        ) : (
          <Button
            style={{ width: 100 }}
            disabled={typeof answers[index] === "undefined"}
            onClick={() => setIndex(index + 1)}
          >
            Next
          </Button>
        )}
      </Segment>
    </MasterPage>
  );
};

export default SurveyPage;
