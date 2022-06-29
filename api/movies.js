
import { Router } from 'express'
const router = Router()
import { getAll, addMovie, getById, updateMovie, deleteById, home } from '../controllers/controllers.js'

router.get('/movies', getAll)

router.post('/movies', addMovie)

router.get('/', getAll)

router.use('/', home)

// router.get('/movies/:id', getById)

// router.put('/movies/:id', updateMovie)

// router.delete('/movies', deleteById)

export default router;