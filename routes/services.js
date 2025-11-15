


import express from 'express';
import Service from '../models/Service.js';
const router = express.Router();

// 🔹 Create a new service
// 🔹 Create a new service
router.post('/', async (req, res) => {
  try {
    const { title, description, price, durationMins, image, category } = req.body;

    // Basic validation
    if (!title || !description || !price || !durationMins) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const newService = new Service({
      title,
      description,
      price,
      durationMins,
      image,
      category,
    });

    const savedService = await newService.save();
    res.status(201).json({
      message: 'Service created successfully',
      service: savedService,
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error while creating service' });
  }
});


router.post('/bulk', async (req, res) => {
  try {
   const serviceList = [
  {
    id: '1',
    title: 'Lower Back Pain Relief',
    category: 'Back Pain',
    price: 799, 
    duration: '45 min',
    rating: 4.8,
    reviews: 234,
    image: 'https://i.pinimg.com/1200x/e9/08/b7/e908b70ba54bfce2e51d56963232ef07.jpg',
    description: 'Specialized treatment for chronic lower back pain using advanced techniques including manual therapy, exercises, and pain management strategies.',
    benefits: [
      'Reduces pain and inflammation',
      'Improves mobility and flexibility',
      'Prevents future injuries',
      'Personalized exercise program'
    ],
  },
  {
    id: '2',
    title: 'Sports Injury Recovery',
    category: 'Sports Injury',
    price: 1299,
    duration: '60 min',
    rating: 4.9,
    reviews: 189,
    image: 'https://i.pinimg.com/736x/fc/07/a9/fc07a9589e2bc8fc2e3f6058f5504cda.jpg',
    description: 'Complete rehabilitation program for sports-related injuries. Focuses on quick recovery and performance enhancement.',
    benefits: [
      'Faster recovery time',
      'Strengthens affected areas',
      'Improves athletic performance',
      'Injury prevention techniques'
    ],
  },
  {
    id: '3',
    title: 'Neck Pain Treatment',
    category: 'Neck Pain',
    price: 699,
    duration: '40 min',
    rating: 4.7,
    reviews: 156,
    image: 'https://i.pinimg.com/1200x/91/53/f4/9153f4e921c679cccecb46ccfd2fd3a2.jpg',
    description: 'Effective treatment for neck stiffness, cervical pain, and work-related neck issues.',
    benefits: [
      'Relieves neck stiffness',
      'Improves posture',
      'Reduces headaches',
      'Work-from-home friendly tips'
    ],
  },
  {
    id: '4',
    title: 'Knee Pain Management',
    category: 'Joint Pain',
    price: 899,
    duration: '50 min',
    rating: 4.8,
    reviews: 267,
    image: 'https://i.pinimg.com/736x/bb/c0/51/bbc051578aa737aee65cf1f3ee27845a.jpg',
    description: 'Comprehensive knee pain treatment including strengthening exercises and pain management.',
    benefits: [
      'Reduces knee pain',
      'Strengthens leg muscles',
      'Improves walking ability',
      'Arthritis management'
    ],
  },
  {
    id: '5',
    title: 'Post-Surgery Rehabilitation',
    category: 'Post Surgery',
    price: 1499,
    duration: '60 min',
    rating: 4.9,
    reviews: 145,
    image: 'https://i.pinimg.com/1200x/40/b1/ad/40b1adb6bcaff65325039c026d73cb61.jpg',
    description: 'Specialized post-operative care to ensure smooth recovery and regain full functionality.',
    benefits: [
      'Accelerated healing',
      'Scar tissue management',
      'Strength rebuilding',
      'Pain-free movement'
    ],
  },
  {
    id: '6',
    title: 'Shoulder Pain Relief',
    category: 'Joint Pain',
    price: 849,
    duration: '45 min',
    rating: 4.7,
    reviews: 198,
    image: 'https://i.pinimg.com/1200x/fe/5a/bc/fe5abcf5a52864567bc53ee99c9104e0.jpg',
    description: 'Treatment for frozen shoulder, rotator cuff injuries, and general shoulder pain.',
    benefits: [
      'Increases range of motion',
      'Reduces inflammation',
      'Strengthens shoulder muscles',
      'Daily activity guidance'
    ],
  },
];

    // ✅ Correct way to insert multiple documents
    const createdServices = await Service.insertMany(serviceList);
    
    res.status(201).json({
      message: `${createdServices.length} services created successfully`,
      services: createdServices
    });
  } catch (err) {
    console.error('Error creating bulk services:', err);
    res.status(500).json({ message: 'Server error while creating bulk services' });
  }
});
router.post('/deleteAll', async (req, res) => {
  try {
    const result = await Service.deleteMany({});    
    res.status(200).json({ message: `Deleted ${result.deletedCount} services.` });
  } catch (err) {
    console.error('Error deleting all services:', err);
    res.status(500).json({ message: 'Server error while deleting services' });
  } 
});

router.get('/', async (req, res) => {
const services = await Service.find().limit(50);
res.json(services);
});


// get single
router.get('/:id', async (req, res) => {
const service = await Service.findById(req.params.id);
if (!service) return res.status(404).json({ message: 'Not found' });
res.json(service);
});


router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error while deleting service" });
  }
});

// UPDATE service
router.put('/:id', async (req, res) => {
  try {
    const { title, description, price, durationMins, image, category } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, price, durationMins, image, category },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      message: "Service updated successfully",
      service: updatedService,
    });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error while updating service" });
  }
});




export default router;
