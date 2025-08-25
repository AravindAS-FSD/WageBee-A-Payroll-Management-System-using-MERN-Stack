import express from 'express';
import {
  addEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  promoteToManager,
} from '../controllers/employeeController.js';

const router = express.Router();


router.get('/', getAllEmployees);
router.get('/:id', getEmployee);
router.post('/', addEmployee);
router.put('/:id', updateEmployee);  
router.delete('/:id', deleteEmployee);
router.post('/promote/:id', promoteToManager);

export default router;

