import { Router } from "express";
import vehicleController from "./vehicles.controllers";
import auth from "../../middleware/auth";

const router = Router();

//create vehicle - only admin
router.post("/", auth("admin"), vehicleController.createVehicle);

//get all vehicles - all roles
router.get("/", auth("admin", "customer"), vehicleController.getVehicle);

// get vehicle by id - all roles
router.get(
  "/:vehicleId",
  auth("admin", "customer"),
  vehicleController.getSingleVehicle
);

// updating vehicles - only admin
router.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle);

// deleting vehicle - only admin
router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle);

const vehicleRoutes = router;
export default vehicleRoutes;
