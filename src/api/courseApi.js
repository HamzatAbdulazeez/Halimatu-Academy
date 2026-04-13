import axiosInstance from './axiosInstance';

export const IMAGE_BASE = 'https://halimatu.farmsglobal.org';

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${IMAGE_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

const buildCourseFormData = (form) => {
    const fd = new FormData();
    fd.append('title',           String(form.title        ?? '').trim());
    fd.append('description',     String(form.description  ?? '').trim());
    fd.append('price',           Number(form.price)        || 0);
    fd.append('status',          form.status               ?? 'draft');
    fd.append('instructor',      String(form.instructor   ?? '').trim());
    fd.append('duration_months', Number(form.duration_months) || 0);
    if (form.imageFile instanceof File) {
        fd.append('image', form.imageFile);
    } else if (form.image) {
        fd.append('image', String(form.image).trim());
    }
    return fd;
};

// ─── COURSES ──────────────────────────────────────────────────────────────────

export const getAllCourses = async () => {
    const res = await axiosInstance.get('/admin/courses');
    return res.data;
};

export const getCourse = async (courseId) => {
    const res = await axiosInstance.get(`/admin/courses/${courseId}`);
    return res.data;
};

export const createCourse = async (form) => {
    const fd = buildCourseFormData(form);
    try {
        const res = await axiosInstance.post('/admin/courses', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    } catch (err) {
        console.error('❌ createCourse error:', JSON.stringify(err?.response?.data, null, 2));
        throw err;
    }
};

export const updateCourse = async (courseId, form) => {
    const fd = buildCourseFormData(form);
    try {
        const res = await axiosInstance.put(`/admin/courses/${courseId}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    } catch (err) {
        console.error('❌ updateCourse error:', JSON.stringify(err?.response?.data, null, 2));
        throw err;
    }
};

export const deleteCourse = async (courseId) => {
    const res = await axiosInstance.delete(`/admin/courses/${courseId}`);
    return res.data;
};

// ─── TOPICS ───────────────────────────────────────────────────────────────────

export const getCourseTopics = async (courseId) => {
    const res = await axiosInstance.get(`/admin/courses/${courseId}/topics`);
    return res.data;
};

export const createTopic = async (courseId, titleOrPayload) => {
    // API expects { title: "string" } as JSON — not { name } or FormData
    const title = typeof titleOrPayload === 'string'
        ? titleOrPayload
        : (titleOrPayload.title ?? titleOrPayload.name ?? '');
    const res = await axiosInstance.post(
        `/admin/courses/${courseId}/topics`,
        { title },
        { headers: { 'Content-Type': 'application/json' } }
    );
    return res.data;
};

export const updateTopic = async (topicId, payload) => {
    const res = await axiosInstance.put(`/admin/topics/${topicId}`, payload);
    return res.data;
};

export const deleteTopic = async (topicId) => {
    const res = await axiosInstance.delete(`/admin/topics/${topicId}`);
    return res.data;
};

// ─── CLASSES ──────────────────────────────────────────────────────────────────

export const getAllCoursesWithTopics = async () => {
    const courses = await getAllCourses(); // existing function

    // Load topics + classes for every course in parallel
    const coursesWithData = await Promise.all(
        courses.map(async (course) => {
            try {
                const topics = await getCourseTopics(course.id);

                const topicsWithClasses = await Promise.all(
                    topics.map(async (topic) => {
                        try {
                            const classes = await getTopicClasses(topic.id);
                            return { ...topic, classes: classes || [] };
                        } catch {
                            return { ...topic, classes: [] };
                        }
                    })
                );

                return { ...course, topics: topicsWithClasses };
            } catch {
                return { ...course, topics: [] };
            }
        })
    );

    return coursesWithData;
};

export const getTopicClasses = async (topicId) => {
    const res = await axiosInstance.get(`/admin/topics/${topicId}/classes`);
    return res.data;
};

export const createClass = async (topicId, payload) => {
    const res = await axiosInstance.post(`/admin/topics/${topicId}/classes`, payload);
    return res.data;
};

export const updateClass = async (classId, payload) => {
    const res = await axiosInstance.put(`/admin/classes/${classId}`, payload);
    return res.data;
};

export const deleteClass = async (classId) => {
    const res = await axiosInstance.delete(`/admin/classes/${classId}`);
    return res.data;
};

// ─── STUDENT DASHBOARD APIS ─────────────────────────────────────────────────

// Student Dashboard APIs
export const getStudentEnrolledCourses = async () => {
    const res = await axiosInstance.get('/user/courses');
    return res.data;
};

// export const getStudentUpcomingClasses = async () => {
//     const res = await axiosInstance.get('/user/classes'); 
//     return res.data;
// };


// ─── ENROLLMENTS API ───────────────────────────────────────────────────────

export const getAllEnrollments = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/admin/enrollments?${queryString}` : '/admin/enrollments';
    const res = await axiosInstance.get(url);
    return res.data;
};

export const getEnrollmentSummary = async () => {
    const res = await axiosInstance.get('/admin/enrollments/stats/summary');
    return res.data;
};

export const getEnrollmentStatsByCourse = async () => {
    const res = await axiosInstance.get('/admin/enrollments/stats/by-course');
    return res.data;
};

export const getCourseEnrollments = async (courseId) => {
    const res = await axiosInstance.get(`/admin/courses/${courseId}/enrollments`);
    return res.data;
};

export const getUserEnrollments = async (userId) => {
    const res = await axiosInstance.get(`/admin/users/${userId}/enrollments`);
    return res.data;
};

export const getEnrollmentDetails = async (enrollmentId) => {
    const res = await axiosInstance.get(`/admin/enrollments/${enrollmentId}`);
    return res.data;
};


// ─── CERTIFICATES API ───────────────────────────────────────────────────────

export const getAllCertificates = async () => {
    const res = await axiosInstance.get('/admin/certificates');
    return res.data;
};

export const getCertificateStats = async () => {
    const res = await axiosInstance.get('/admin/certificates/stats');
    return res.data;
};

export const getPendingCertificates = async () => {
    const res = await axiosInstance.get('/admin/certificates/pending');
    return res.data;
};

export const getIssuedCertificates = async () => {
    const res = await axiosInstance.get('/admin/certificates/issued');
    return res.data;
};

export const getRevokedCertificates = async () => {
    const res = await axiosInstance.get('/admin/certificates/revoked');
    return res.data;
};

export const issueCertificate = async (certificateId) => {
    const res = await axiosInstance.put(`/admin/certificates/${certificateId}/issue`);
    return res.data;
};

export const revokeCertificate = async (certificateId) => {
    const res = await axiosInstance.put(`/admin/certificates/${certificateId}/revoke`);
    return res.data;
};

export const deleteCertificate = async (certificateId) => {
    const res = await axiosInstance.delete(`/admin/certificates/${certificateId}`);
    return res.data;
};