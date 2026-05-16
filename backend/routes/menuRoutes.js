const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menuController')
const { requireAdmin } = require('../middleware/auth')

router.get('/:id',            menuController.getById)
router.post('/',  requireAdmin, menuController.create)
router.put('/:id', requireAdmin, menuController.update)
router.delete('/:id', requireAdmin, menuController.remove)

module.exports = router
