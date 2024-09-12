import React, { useEffect, useState } from 'react';
import { fetchSubjectById, updateSubject } from '../../../../api/subjectApi';
import { fetchSections } from '../../../../api/sectionApi';
import Swal from 'sweetalert2';

const UpdateSubjectModal = ({ id, onClose, reloadData }) => {
    const [subjectName, setSubjectName] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading
                const subjectResponse = await fetchSubjectById(id);
                setSubjectName(subjectResponse.data.subjectName);
                setSectionId(subjectResponse.data.sectionId._id);

                const sectionsResponse = await fetchSections();
                setSections(sectionsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch subject details. Please try again later.',
                });
                onClose(); // Close modal on error
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, [id, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateSubject(id, { subjectName, sectionId });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Subject updated successfully!',
            });
            reloadData(); // Re-fetch the data after updating
            onClose(); // Close modal after updating
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to update subject. Please try again later.',
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Update Subject</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg font-semibold">✖</button>
                </div>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                            <input
                                type="text"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                            <select
                                value={sectionId}
                                onChange={(e) => setSectionId(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="" disabled>Select a section</option>
                                {sections.map((section) => (
                                    <option key={section._id} value={section._id}>
                                        {section.sectionName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Update Subject
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateSubjectModal;
