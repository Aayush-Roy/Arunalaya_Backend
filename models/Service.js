import mongoose from 'mongoose';
const serviceSchema = new mongoose.Schema({
title: String,
description: String,
price: Number,
durationMins: Number,
image: String,
category: String,
},
 { timestamps: true })
 ;
const Service = mongoose.model('Service', serviceSchema);
export default Service;