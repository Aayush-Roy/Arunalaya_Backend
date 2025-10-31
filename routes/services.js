
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

// router.post('/bulk',async(req,res)=>{
//     try{
//     const serviceList = new Service([
//   {
//     "title": "Back Pain Therapy",
//     "description": "Deep muscle relaxation therapy to relieve back pain",
//     "price": 699,
//     "durationMins": 45,
//     "image": "https://example.com/backpain.jpg",
//     "category": "Pain Relief"
//   },
//   {
//     "title": "Aromatherapy Massage",
//     "description": "Relaxing full body massage using essential oils",
//     "price": 899,
//     "durationMins": 60,
//     "image": "https://example.com/aroma.jpg",
//     "category": "Wellness"
//   },
//   {
//     "title": "Hair Spa Treatment",
//     "description": "Rejuvenate your hair with deep conditioning and oil massage",
//     "price": 499,
//     "durationMins": 40,
//     "image": "https://example.com/hairspa.jpg",
//     "category": "Salon"
//   },
//   {
//     "title": "Facial Glow Therapy",
//     "description": "Hydrating and brightening facial for glowing skin",
//     "price": 799,
//     "durationMins": 50,
//     "image": "https://example.com/facialglow.jpg",
//     "category": "Beauty"
//   },
//   {
//     "title": "Acupressure Therapy",
//     "description": "Pressure point therapy to balance energy and relieve stress",
//     "price": 599,
//     "durationMins": 30,
//     "image": "https://example.com/acupressure.jpg",
//     "category": "Pain Relief"
//   },
//   {
//     "title": "Foot Reflexology",
//     "description": "Foot massage that targets reflex points to promote healing",
//     "price": 499,
//     "durationMins": 30,
//     "image": "https://example.com/reflexology.jpg",
//     "category": "Wellness"
//   },
//   {
//     "title": "Thai Massage",
//     "description": "Traditional Thai stretching and massage for full body relaxation",
//     "price": 999,
//     "durationMins": 75,
//     "image": "https://example.com/thai.jpg",
//     "category": "Therapy"
//   },
//   {
//     "title": "Head & Shoulder Massage",
//     "description": "Targeted massage for stress relief in head and shoulders",
//     "price": 399,
//     "durationMins": 25,
//     "image": "https://example.com/headshoulder.jpg",
//     "category": "Relaxation"
//   },
//   {
//     "title": "Body Scrub & Polish",
//     "description": "Full body exfoliation and polish for smooth glowing skin",
//     "price": 899,
//     "durationMins": 60,
//     "image": "https://example.com/bodyscrub.jpg",
//     "category": "Beauty"
//   },
//   {
//     "title": "Hot Stone Therapy",
//     "description": "Soothing massage using heated stones for deep relaxation",
//     "price": 1099,
//     "durationMins": 70,
//     "image": "https://example.com/hotstone.jpg",
//     "category": "Therapy"
//   }
// ]
// )
//     await serviceList.save();
//     }catch(err){
//         console.error('Error creating bulk services:', err);
//         res.status(500).json({ message: 'Server error while creating bulk services' });
//     }
// })


// list services

router.post('/bulk', async (req, res) => {
  try {
    const serviceList = [
      {
        title: "Back Pain Therapy",
        description: "Deep muscle relaxation therapy to relieve back pain",
        price: 699,
        durationMins: 45,
        image: "https://example.com/backpain.jpg",
        category: "Pain Relief"
      },
      {
        title: "Aromatherapy Massage",
        description: "Relaxing full body massage using essential oils",
        price: 899,
        durationMins: 60,
        image: "https://example.com/aroma.jpg",
        category: "Wellness"
      },
      {
        title: "Hair Spa Treatment",
        description: "Rejuvenate your hair with deep conditioning and oil massage",
        price: 499,
        durationMins: 40,
        image: "https://example.com/hairspa.jpg",
        category: "Salon"
      },
      {
        title: "Facial Glow Therapy",
        description: "Hydrating and brightening facial for glowing skin",
        price: 799,
        durationMins: 50,
        image: "https://example.com/facialglow.jpg",
        category: "Beauty"
      },
      {
        title: "Acupressure Therapy",
        description: "Pressure point therapy to balance energy and relieve stress",
        price: 599,
        durationMins: 30,
        image: "https://example.com/acupressure.jpg",
        category: "Pain Relief"
      },
      {
        title: "Foot Reflexology",
        description: "Foot massage that targets reflex points to promote healing",
        price: 499,
        durationMins: 30,
        image: "https://example.com/reflexology.jpg",
        category: "Wellness"
      },
      {
        title: "Thai Massage",
        description: "Traditional Thai stretching and massage for full body relaxation",
        price: 999,
        durationMins: 75,
        image: "https://example.com/thai.jpg",
        category: "Therapy"
      },
      {
        title: "Head & Shoulder Massage",
        description: "Targeted massage for stress relief in head and shoulders",
        price: 399,
        durationMins: 25,
        image: "https://example.com/headshoulder.jpg",
        category: "Relaxation"
      },
      {
        title: "Body Scrub & Polish",
        description: "Full body exfoliation and polish for smooth glowing skin",
        price: 899,
        durationMins: 60,
        image: "https://example.com/bodyscrub.jpg",
        category: "Beauty"
      },
      {
        title: "Hot Stone Therapy",
        description: "Soothing massage using heated stones for deep relaxation",
        price: 1099,
        durationMins: 70,
        image: "https://example.com/hotstone.jpg",
        category: "Therapy"
      }
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


export default router;