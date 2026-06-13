// import the faculty model functions
// we need to use the functions and list of information from the faculty model
// this is the code we exported from faculty model: export { getFacultyById, getSortedFaculty };

import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

// create a facultyListPage function that renders the faculty list page
// create a facultyListPage function that renders the faculty list page
const facultyPage = async (req, res) => {
    const validSortOptions = ['name', 'department', 'title'];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'department';
    const facultyList = await getSortedFaculty(sortBy);
    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: facultyList,
        currentSort: sortBy
    });
};

// create a facultyDetailPage function that uses rout parameters to look up individual faculty (think about looking up courses like we did in catalog)
const facultyDetailPage = async (req, res, next) => {
    const facultySlug = req.params.facultySlug;
    const facultyMember = await getFacultyBySlug(facultySlug);
    if (Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    }
    res.render('faculty/detail', {
        title: `${facultyMember.name} - Faculty Profile`,
        faculty: facultyMember
    });
};
// export the functions
export { facultyPage, facultyDetailPage };