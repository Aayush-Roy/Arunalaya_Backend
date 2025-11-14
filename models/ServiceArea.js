// import mongoose from "mongoose";

// const serviceAreaSchema = new mongoose.Schema({
//    name: String,
//    center: {
//       lat: Number,
//       lng: Number
//    },
//    radiusKm: {
//       type: Number,
//       default: 7
//    }
// });

// export default mongoose.model("ServiceArea", serviceAreaSchema);
import mongoose from "mongoose";

const serviceAreaSchema = new mongoose.Schema({
  name: String,
  center: {
    lat: Number,
    lng: Number,
  },
  radiusKm: {
    type: Number,
    default: 7,
  },
});

export default mongoose.models.ServiceArea ||
  mongoose.model("ServiceArea", serviceAreaSchema);
