import axiosInstance from '../axiosInstance';

// Fetch all branches
export const getAllBranches = async () => {
    try {
        const response = await axiosInstance.get('/branch/get-all'); // Update the endpoint as needed
        return response.data.data.branches;
        // return response.data;
    } catch (error) {
        console.error('Error fetching branches:', error);
        throw error;
    }
};
// Fetch a branch by ID
export const getBranchById = async (branchId) => {
    try {
        const response = await axiosInstance.get(`/branches/${branchId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching branch with ID ${branchId}:`, error);
        throw error;
    }
};

// Create a new branch
export const createBranch = async (branchData) => {
    try {
        const response = await axiosInstance.post('/branches', branchData);
        return response.data;
    } catch (error) {
        console.error('Error creating branch:', error);
        throw error;
    }
};

// Update an existing branch
export const updateBranch = async (branchId, branchData) => {
    try {
        const response = await axiosInstance.put(`/branches/${branchId}`, branchData);
        return response.data;
    } catch (error) {
        console.error(`Error updating branch with ID ${branchId}:`, error);
        throw error;
    }
};

// Delete a branch
export const deleteBranch = async (branchId) => {
    try {
        const response = await axiosInstance.delete(`/branches/${branchId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting branch with ID ${branchId}:`, error);
        throw error;
    }
};
