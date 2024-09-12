import axiosInstance from '../axiosInstance';

// Fetch subject by ID
export const fetchSubjectById = async (branchId) => {
        try {
            const response = await axiosInstance.get(`/subject/get-by-id/${branchId}`);
            return response.data; // Handle the fetched subjects
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error; // Handle or propagate error
        }
    };

// Fetch all subjects by branch ID
export const fetchSubjects = async () => {
    try {
        const branchId = localStorage.getItem('branchId');
        
        if (!branchId) {
            throw new Error('Branch ID is not available in localStorage.');
        }

        const response = await axiosInstance.get('/subject/get-all', {
            params: { branchId }
        });

        return response.data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch subjects. Please try again later.',
        });
        throw error;
    }
};

// Create a new subject
export const createSubject = async (subjectData) => {
    try {
        const response = await axiosInstance.post('/subject/create', subjectData);
        return response.data; // Handle the newly created subject
    } catch (error) {
        console.error('Error creating subject:', error);
        throw error; // Handle or propagate error
    }
};

// Update a subject
export const updateSubject = async (id, subjectData) => {
    try {
        const response = await axiosInstance.put(`/subject/update/${id}`, subjectData);
        return response.data;
    } catch (error) {
        console.error('Error updating subject:', error);
        throw error; // Handle or propagate error
    }
};

// Delete a subject
export const deleteSubject = async (id) => {
    try {
        const response = await axiosInstance.delete(`/subject/delete/${id}`);
        return response.data; // Handle the deleted subject
    } catch (error) {
        console.error('Error deleting subject:', error);
        throw error; // Handle or propagate error
    }
};
