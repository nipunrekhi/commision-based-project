import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import ProtectedRoute from "./routing/ProtectedRoute";
import "./App.css";
import UsersListScreen from "./screens/UsersListScreen";
import EditUserScreen from "./screens/EditUserScreen";
import AgentListScreen from "./screens/AgentListScreen";
import AgentUserListScreen from "./screens/AgentUserListScreen";
import UserDetailsScreen from "./screens/UserDetailsScreen";
import ShareReleaseScreen from "./screens/ShareReleaseScreen";
import BidingScreen from "./screens/BidingScreen";

function App() {
  return (
    <Router>
      <Header />
      <main className="container content">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/displayShares" element={<ShareReleaseScreen />} />
          </Route>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/editUser/:id" element={<EditUserScreen />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/user-profile" element={<ProfileScreen />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/agentList/:ref_email" element={<AgentListScreen />} />
          </Route>
          <Route
            path="/userOfAgent/:ref_email"
            element={<AgentUserListScreen />}
          />
          <Route path="/details/:id" element={<UserDetailsScreen />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/usersList" element={<UsersListScreen />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/biding" element={<BidingScreen />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
