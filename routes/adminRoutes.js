const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Add this line to require the auth middleware
const User = require("../models/user");

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

router.put("/makeAdmin/:userToUpdate", auth, async (req, res) => {
  try {
    const userLogged = await User.findById(req.user._id); // Récupérer l'utilisateur connecté
    const isAdmin = userLogged.role === "admin";

    if (!isAdmin) {
      return res
        .status(401)
        .json({ message: "Seuls les admins peuvent créer des admins" });
    }

    const { userToUpdate } = req.params;
    const user = await User.findById(userToUpdate);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.role = "admin";
    await user.save();

    res.json({ message: "Utilisateur promu administrateur avec succès", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
