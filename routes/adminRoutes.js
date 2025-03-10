const express = require("express");
const router = express.Router();

router.put("/makeAdmin/:userToUpdate", auth, async (req, res) => {
    try {
      const userLogged = await User.findById(req.user._id); // Récupérer l'utilisateur connecté
      const isAdmin = userLogged.role === "admin";
  
      if (!isAdmin) {
        return res.status(401).json({ message: "Seuls les admins peuvent créer des admins" });
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