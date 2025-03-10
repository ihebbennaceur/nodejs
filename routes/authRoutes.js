const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();


/**
 * @swagger
 * /api/admin/makeAdmin/{userToUpdate}:
 *   put:
 *     summary: Promote a user to admin
 *     description: Only admins can promote other users to admin.
 *     parameters:
 *       - in: path
 *         name: userToUpdate
 *         required: true
 *         description: ID of the user to promote
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User promoted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 */
router.post("/login", login);
// Forget password
// Reset password

// Create admin

module.exports = router;
