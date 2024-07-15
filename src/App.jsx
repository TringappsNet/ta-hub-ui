import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
import Navbar from "./components/Navbar";
import Login from "./components/login";
import Register from "./components/register";
import ForgetPassword from "./components/forgetPassword";
import ResetPassword from "./components/resetNewPassword";
import ResetNew from "./components/resetPassword";
import Board from "./components/Dnd";
// import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import ApprovalRequest from "./components/ApprovalRequest";
import FullFeaturedCrudGrid from "./Grid/FullFeaturedCrudGrid";
import Candidates from "./Grid/Candidates";
import Positions from "./Grid/Positions";
import Users from "./Grid/Users";
import Clients from "./Grid/Clients";
const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route >
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/candidates" element={<Candidates/>}/>
            <Route path="/positions" element={<Positions/>}/>
            <Route path="/users" element={<Users/>}/>
            <Route path="/clients" element={<Clients/>}/>
            <Route path="/reset-new" element={<ResetNew/>} />
            <Route path="/side-bar" element={<Sidebar/>} />
            <Route path="/side-bar" element={<Sidebar/>} />
            <Route path="/approval-req" element={<ApprovalRequest/>} /> 
            
                
            {/* <Route path="/board" element={<Board/>} /> */}
            
            {/* <Route path="/dashboard" element={<Dashboard/>} /> */}

            

          </Route>
        </Routes>
      </BrowserRouter>
  );
};

export default App;