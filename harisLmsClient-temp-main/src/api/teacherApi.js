import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

// Fetch all teachers for a specific branch
export const fetchTeachers = async () => {
    try {
        const branchId = localStorage.getItem('branchId');
        if (!branchId) {
            throw new Error('Branch ID is missing from local storage');
        }

        const response = await axiosInstance.get('/teacher/get-all', {
            params: { branchId }
        });

        return response.data; // Handle the fetched teachers
    } catch (error) {
        console.error('Error fetching teachers:', error);
    }
};

// Fetch a teacher by ID
export const fetchTeacherById = async (id) => {
    try {
        const response = await axiosInstance.get(`/teacher/get-by-id/${id}`);
        return response.data; // Handle the fetched teacher data
    } catch (error) {
        console.error('Error fetching teacher by ID:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Create a new teacher
export const createTeacher = async (teacherData) => {
    try {
        const response = await axiosInstance.post('/teacher/create', teacherData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Teacher created successfully!',
        });
        return response.data; // Handle the newly created teacher
    } catch (error) {
        console.error('Error creating teacher:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Update a teacher by ID
export const updateTeacher = async (id, teacherData) => {
    try {
        const response = await axiosInstance.put(`/teacher/update/${id}`, teacherData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Teacher updated successfully!',
        });
        return response.data; // Handle the updated teacher
    } catch (error) {
        console.error('Error updating teacher:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Delete a teacher by ID
export const deleteTeacher = async (id) => {
    try {
        const response = await axiosInstance.delete(`/teacher/delete/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Teacher deleted successfully!',
        });
        return response.data; // Handle the deleted teacher
    } catch (error) {
        console.error('Error deleting teacher:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};
