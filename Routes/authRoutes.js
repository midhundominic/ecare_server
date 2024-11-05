const express = require("express");
const router = express.Router();
const patientControllers = require("../controllers/patientControllers");
const adminControllers = require("../controllers/adminController");
const doctorControllers = require("../controllers/doctorController");
const authControllers = require("../controllers/authControllers");
const coordinatoControllers = require("../controllers/coordinatorControllers");
const forgotPassword = require("../controllers/authforgotPassword");
const resetPassword = require("../controllers/resetPassword");
const profileCoordinator = require("../controllers/profileControllers/coordinatorControllers");
const authMiddleware = require("../middleware/auth");
const pdfUpload = require("../middleware/pdf-upload");
const uploadMiddleware = require("../middleware/upload");
const profilePatient = require("../controllers/profileControllers/patientControllers");
const profileDoctor = require ("../controllers/profileControllers/doctorControllers");
const appointmentControllers = require("../controllers/appointmentControllers");
const coordinatorHealthControllers = require("../controllers/coordinatorHealthControllers");
const reviewControllers = require('../controllers/reviewControllers');
const paymentControllers = require('../controllers/paymentControllers');
const medicineControllers = require('../controllers/medicineControllers');
const prescriptionControllers = require('../controllers/prescriptionController');
const medicineController = require('../controllers/medicineController');

//patient

router.post("/patient-signup", patientControllers.signup);
router.post("/patient-signin", authControllers.signin);
router.post("/patientauthWithGoogle", patientControllers.authWithGoogle); 
router.post("/forgot-password",forgotPassword.forgotPassword);
router.post("/varifycode",resetPassword.verifyCode);
router.post("/reset-password",resetPassword.resetPassword);
router.get("/patients-view",patientControllers.getAllPatient);

//doctor

router.post("/doctor-registration", doctorControllers.registerDoctor);
router.post("/doctor-signin", authControllers.signin);
router.get("/doctors-view",doctorControllers.getAllDoctors);
router.get("/:doctorId/appointments",doctorControllers.getDoctorAppointments);
router.get("/doctor-appointments/:doctorId",authMiddleware,doctorControllers.getAppointmentsByDoctorId);
router.get('/doctors/:doctorId/dashboard-stats',doctorControllers.getDoctorDashboardStats);

//doctorid
router.get("/doctor/:id", doctorControllers.getDoctorById);


//admin
router.patch('/admin/toggle-status/:userType/:id', adminControllers.toggleUserStatus);
router.patch('/admin/edit-user/:userType/:id', adminControllers.editUserDetails);
router.get('/admin/dashboardstats', adminControllers.getDashboardStats);


router.post("/admin-signin", adminControllers.adminSignin);

//coordinator

router.post("/coordinator-registration", coordinatoControllers.registerCoordinator);
router.post("/coordinator-signin", authControllers.signin);
router.get("/coordinator-view",coordinatoControllers.getAllCoordinator);
router.get("/prescriptions/:prescriptionId",prescriptionControllers.getAppointmentDetails);


//profile Photo

router.post("/doctor-profile-photo",profileDoctor.uploadDoctorProfilePhoto);


//profile
router.get("/coordinator-profile",authMiddleware,profileCoordinator.getCoordinatorProfile);
router.get("/patient-profile", authMiddleware, profilePatient.getPatientProfile);
router.put("/patient-profile", authMiddleware, profilePatient.updatePatientProfile);
router.get("/doctor-profile",authMiddleware,profileDoctor.getDoctorProfile);
router.put("/coordinator-update",profileCoordinator.updateCoordinatorProfile);

//delete
router.delete("/doctor/:id",doctorControllers.deleteDoctor);
router.delete("/patient/:id",patientControllers.deletePatientById);
router.delete("/coordinator/:id",coordinatoControllers.deleteCoordinator);

//appointments
router.post("/create-appointment",appointmentControllers.createAppointment);
router.get("/availability",appointmentControllers.getUnavailableTimeSlots);
router.get("/patient-appointments/:patientId",authMiddleware,appointmentControllers.getAppointmentsByPatientId);
router.put("/cancel-appointment/:appointmentId",appointmentControllers.cancelAppointment);
router.put("/reschedule-appointment/:appointmentId",appointmentControllers.rescheduleAppointment);

//Heath Data
// router.post("healthdata/add",coordinatoControllers.addHealthData);
// router.get("healthdata/patient/:patientId",coordinatoControllers.getPatientHealthRecords);
// router.put("healthdata/edit/:id",coordinatoControllers.editHealthData);
router.get('/healthdata-patients',coordinatorHealthControllers.getAllPatients);
router.post('/healthdata-records',coordinatorHealthControllers.addHealthRecord);
router.get('/healthdata-records/:patientId',coordinatorHealthControllers.getPatientRecords);
router.put('/healthdata-records/:id',coordinatorHealthControllers.updateHealthRecord);

//admin Appointments

router.get('/appointments', appointmentControllers.getAllAppointments);
router.put('/admin/cancel-appointment/:appointmentId', appointmentControllers.cancelAppointment);
router.put('/admin/reschedule-appointment/:appointmentId', appointmentControllers.rescheduleAppointment);
router.get("/appointments/unavailable-slots", appointmentControllers.getUnavailableTimeSlots);

//Leave
router.get("/leaves",adminControllers.getLeaveRequests);
router.post("/leaves/status",adminControllers.updateLeaveStatus);
router.post("/leaves/apply/:doctorId",doctorControllers.applyForLeave);
router.get("/leaves/:doctorId",doctorControllers.getLeaveRequests);
router.delete("/leaves/cancel/:leaveId", doctorControllers.cancelLeave);

//leave
router.get("/leaves/:doctorId",doctorControllers.getLeaveRequests);
router.delete("/leaves/cancel/:leaveId", doctorControllers.cancelLeave);


//appointments
router.get('/appointments/:appointmentId', appointmentControllers.getAppointmentDetails);
router.put('/appointments/:appointmentId/absent', appointmentControllers.markPatientAbsent);
router.put('/appointments/:appointmentId/start-consultation', appointmentControllers.startConsultation);
router.post('/appointments/:appointmentId/prescription', appointmentControllers.submitPrescription);
router.get('/patients/:patientId/records', appointmentControllers.getPatientRecords);
router.get('/care-coordinator/pending-tests', appointmentControllers.getPendingTests);
router.get('/care-coordinator/completed-tests', appointmentControllers.getCompletedTests);
router.put('/update-test-result/:appointmentId/:testId',appointmentControllers.updateTestResult)
router.put('/care-coordinator/test-results/:appointmentId/:testId', appointmentControllers.submitTestResults);
router.get('/completed/:patientId',appointmentControllers.getCompletedAppointments);

//review
router.post('/review/:appointmentId/:doctorId',authMiddleware,reviewControllers.submitReview);

//payment
router.post('/payment/order', paymentControllers.createOrder);
router.post('/payment/verify', paymentControllers.verifyPayment);
router.post('/payment/save', paymentControllers.savePaymentDetails);
router.get('/payment/user/:userId',paymentControllers.getPaymentsByUser);


//Precription

router.post('/prescriptions/create',authMiddleware,prescriptionControllers.createPrescription);
router.post(
    '/prescriptions/upload-test-result', 
    authMiddleware,
    pdfUpload.single('resultPDF'),
    prescriptionControllers.uploadTestResult
  );
router.get('/prescriptions/test-results/:id',prescriptionControllers.getPrescription);
router.get('/prescriptions/patient/:patientId',prescriptionControllers.getPatientPrescriptions);
router.get('/prescriptions/doctor/:patientId',prescriptionControllers.getPatientRecords);
router.get('/prescriptions/pendingtests',authMiddleware,prescriptionControllers.getPrescriptionsWithPendingTests);
router.put('/prescriptions/update/:appointmentId',authMiddleware,prescriptionControllers.updatePrescription);

//medicine

router.post('/medicines/add',medicineController.addMedicine);
router.get('/medicines/list', medicineController.getMedicinesList);
router.patch('/medicines/stock/:medicineId', medicineController.updateMedicineStock);
router.delete('/medicines/:medicineId', medicineController.deleteMedicine);

module.exports = router;
