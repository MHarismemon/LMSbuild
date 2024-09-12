import React, { useEffect } from 'react';
import { useAuth } from '../../AuthProvider';
import img1 from '../../assets/teacher.png';
import img2 from '../../assets/staff.png';
import img3 from '../../assets/present.png';
import img4 from '../../assets/emp.png';
import img5 from '../../assets/class.png';
import img6 from '../../assets/newJoin.png';
import img7 from '../../assets/fee.png';
import img8 from '../../assets/re-fee.png';
import { adminName, branchTypeAdmin } from '../../index';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const dataBar = {
    labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
        {
            label: 'Monthly Attendance',
            data: [60, 50, 70, 80, 40, 90, 50],
            backgroundColor: '#6f9bf2',
        },
    ],
};

const dataLine = {
    labels: ['Apr 25', 'Apr 26', 'Apr 27', 'Apr 28', 'Apr 29'],
    datasets: [
        {
            label: 'Student Analysis',
            data: [60, 50, 55, 65, 70],
            borderColor: '#4F46E5',
            backgroundColor: '#6f9bf2',
            fill: true,
        },
    ],
};

const Dashboard = () => {
    const { userInfo } = useAuth();

    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('hasReloaded');
        if (!hasReloaded) {
            sessionStorage.setItem('hasReloaded', 'true');
            window.location.reload();
        }
    }, []);

    return (
        <div className="container mx-auto px-4">
            <div className="mb-4">
                <p className="text-custom-blue text-lg md:text-xl">Welcome Back <b>{userInfo.branchTypeAdmin}</b> Branch Admin, <b>{userInfo.adminName}</b></p>
                <p className="text-gray-500 text-sm md:text-base">Track your Analytics and Manage your School Teacher and Staff</p>
            </div>

            {/* Grid for Analytics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Teacher</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img1} alt="Total Teacher" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Other Staff Members</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img2} alt="Other Staff Members" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Present</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img3} alt="Total Present" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Employee</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img4} alt="Total Employee" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>
            </div>

            {/* Grid for Other Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Assign Classes Today</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img5} alt="Assign Classes Today" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">New Join This Month</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img6} alt="New Join This Month" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Fee Paid</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img7} alt="Fee Paid" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Fee Remaining</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img8} alt="Fee Remaining" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800">Monthly Attendance</h2>
                    <div className="mt-4">
                        <Bar data={dataBar} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800">Student Analysis</h2>
                    <div className="mt-4">
                        <Line data={dataLine} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
