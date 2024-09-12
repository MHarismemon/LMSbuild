import Dashboard from "./users/branch-admin/Dashboard";
import ClassSection from "./users/branch-admin/ClassSection/ClassSection";
import UserManagementStaff from "./users/branch-admin/UserManagement/UserManagementStaff";
import UserManagementStudent from "./users/branch-admin/UserManagement/UserManagementStudent.jsx";
import UserManagementGuardian from "./users/branch-admin/UserManagement/UserManagementGuardian.jsx";
import UserManagementTeacher from "./users/branch-admin/UserManagement/UserManagementTeacher.jsx";
import AddStudent from "./users/branch-admin/UserManagement/Student/AddStudent.jsx";
import EditStudent from "./users/branch-admin/UserManagement/Student/EditStudent.jsx";
import ViewStudent from "./users/branch-admin/UserManagement/Student/ViewStudent.jsx";
import RejectedLeave from "./users/branch-admin/RejectedLeave";
import ApprovedLeave from "./users/branch-admin/ApprovedLeave";
import App from "./App";
import SuperAdminLayout from "./SuperAdminLayout.jsx";
import SuperAdminDashboard from "./users/super-admin/SuperAdminDashboard.jsx";
import SuperAdminUser from "./users/super-admin/SuperAdminUser.jsx";
import SuperAdminBatch from "./users/super-admin/SuperAdminBranch.jsx";
import LoginForm from "./loginForm";

const adminName = localStorage.getItem('adminName');
const adminEmail = localStorage.getItem('adminEmail');
const username = localStorage.getItem('username');
const branchTypeAdmin = localStorage.getItem('branchTypeAdmin');
const baseURL = 'https://lms.bluejaysschool.com/assets/images/';

export {
    baseURL,
    adminName,
    adminEmail,
    username,
    branchTypeAdmin,
    Dashboard,
    ClassSection,
    UserManagementStaff,
    UserManagementGuardian,
    UserManagementStudent,
    UserManagementTeacher,
    App,
    LoginForm,
    ApprovedLeave,
    RejectedLeave,
    AddStudent,
    ViewStudent,
    EditStudent,
    SuperAdminLayout,
    SuperAdminDashboard,
    SuperAdminBatch,
    SuperAdminUser
};