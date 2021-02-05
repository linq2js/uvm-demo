import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import usePage from "./hooks/usePage";
import StudentListPage from "./pages/StudentListPage";
import StudentReportPage from "./pages/StudentReportPage";
import SurveyListPage from "./pages/SurveyListPage";
import SurveyPage from "./pages/SurveyPage";

const pages = {
  dashboard: DashboardPage,
  studentList: StudentListPage,
  studentReport: StudentReportPage,
  surveyList: SurveyListPage,
  survey: SurveyPage,
};

const App = () => {
  const page = usePage();
  const Component = pages[page] || LoginPage;
  return <Component />;
};

export default App;
