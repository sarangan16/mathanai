import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PeopleList from "./pages/PeopleList";
import AddPerson from "./pages/AddPerson";
import EditPerson from "./pages/EditPerson";
import PrivateRoute from "./components/PrivateRoute";
import Tree from "./pages/Tree";
import Dashboard from "./pages/Dashboard";

// ...other imports

function App() {
  return (
    <Router>
      <Routes>
        {/* Other routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/people"
          element={
            <PrivateRoute>
              <PeopleList />
            </PrivateRoute>
          }
        />
        <Route
          path="/people/add"
          element={
            <PrivateRoute>
              <AddPerson />
            </PrivateRoute>
          }
        />
        <Route
          path="/people/edit/:id"
          element={
            <PrivateRoute>
              <EditPerson />
            </PrivateRoute>
          }
        />
        <Route
          path="/tree"
          element={
            <PrivateRoute>
              <Tree />
            </PrivateRoute>
          }
        />

        {/* ...other routes */}
      </Routes>
    </Router>
  );
}

export default App;
