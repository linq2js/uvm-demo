import useUser from "../hooks/useUser";
import MasterPage from "./MasterPage";

const DashboardPage = () => {
  const user = useUser();
  return (
    <MasterPage header="Dashboard">
      <div style={{ minHeight: 500 }}>
        This is dashboard for{" "}
        <strong>
          {user.name} ({user.role})
        </strong>
        . We can add some widgets or user guides here
      </div>
    </MasterPage>
  );
};

export default DashboardPage;
