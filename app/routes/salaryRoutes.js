const express = require('express');
const { getSalaries, addSalary, updateSalary, getSalaryByUserId } = require('../controllers/salaryController');
const router = express.Router();

router.get('/', getSalaries);
router.post('/add', addSalary);
router.put('/:salary_id', updateSalary);
router.get('/:userId', getSalaryByUserId);
module.exports = router;
