const { json } = require('body-parser');
const {getDb}=require('../db/connect');
const {ObjectId}=require('mongodb');

// Get all jewels
const getJewels=async(req,res)=>{
    try{
        const jewels =await getDb().collection('jewels').find().toArray();
        res.status(200).json(jewels);
    }
    catch(error){
        console.error('Error fetching jewels:',error);
        res.status(500).json({message:'Error fetching jewels'});
    }
};
const getJewelById=async(req,res)=>{
    try{
        const {id} = req.params;

        if(!ObjectId.isValid(id)){
            return res.status(400).json({message:'Invalid jewel ID'});
        }
        const jewel=await getDb().collection('jewels').findOne({_id:new ObjectId(id)});
        if(!jewel){
            return res.status(404).json({message:'Jewel not found'});
        }
        res.status(200).json(jewel);
    }
    catch(error){
        console.error('Error fetching jewel by ID:',error);
        res.status(500).json({message:'Error fetching jewel by ID'});};
};

const validateJewel=(jewel)=>{
    const errors=[];
    if (!jewel.name || jewel.name.trim() ===''){
        errors.push('Name is required');
    }
    if (!jewel.type || jewel.type.trim() ===''){
        errors.push('Type is required');
    }
    if (!jewel.material || jewel.material.trim() ===''){
        errors.push('Material is required');
    }
    if (!jewel.price || isNaN(jewel.price) || jewel.price <=0){
        errors.push('Valid price greater than 0 is required');
    }
    if (!jewel.description || jewel.description.trim() ===''){
        errors.push('Description is required');
    }
    if (!jewel.weight || isNaN(jewel.weight) || jewel.weight <=0){
        errors.push('Valid weight greater than 0 is required');
    }
    if (jewel.stock ===undefined || isNaN(jewel.stock) || jewel.stock <0){
        errors.push('Valid stock of 0 or more is required');
    }
    if (!jewel.imageUrl || jewel.imageUrl.trim() ===''){
        errors.push('Image URL is required');
    }
    return errors;
};

// Add a new jewel
const createJewel = async(req,res) => {
    const jewel={
        name:req.body.name,
        type:req.body.type,
        material:req.body.material,
        price: parseFloat(req.body.price),
        description:req.body.description,
        weight: parseFloat(req.body.weight),
        stock: parseInt(req.body.stock),
        imageUrl:req.body.imageUrl,
    }
 // Validate
        const errors = validateJewel(jewel);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

    try {
        const response = await getDb().collection('jewels').insertOne(jewel);

        res.status(201).json({ _id: response.insertedId });

    } catch (error) {
        res.status(500).json({ message: 'Error creating jewel' });
    }
};
const updateJewel =async (req, res) => {
    const {id} = req.params;
    if (!ObjectId.isValid(id)){
        return res.status(400).json({message:'Invalid jewel ID'})
    }
    const errors =validateJewel (req.body);
   
        if (errors.length >0){
            return res.status (400).json({errors})
        }
   
    const updated = {
         name: req.body.name,
        type: req.body.type,
         material: req.body.material,
        price: parseFloat(req.body.price),
        description: req.body.description,
        weight: parseFloat(req.body.weight),
        stock: parseInt(req.body.stock),
        imageUrl: req.body.imageUrl,
    }
    const result =await getDb()
    .collection('jewels')
    .updateOne({_id: new ObjectId(id)}, {$set: updated})
    if (result.matchedCount === 0){
        return res.status (404).json ({message:'Jewel not found'})
    }else{
        res.status(200).json({message:'Jewel updated successfully'})
    }
}
const deleteJewel = async (req, res) => {
    const { id } = req.params;

    // 1. Validate ID
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid jewel ID' });
    }

    try {
        // 2. Check if jewel exists
        const jewel = await getDb()
            .collection('jewels')
            .findOne({ _id: new ObjectId(id) });

        if (!jewel) {
            return res.status(404).json({ message: 'Jewel not found' });
        }

        // 3. Delete the jewel
        await getDb()
            .collection('jewels')
            .deleteOne({ _id: new ObjectId(id) });

        res.status(200).json({ message: 'Jewel deleted successfully' });

    } catch (error) {
        console.error('Error deleting jewel:', error);
        res.status(500).json({ message: 'Error deleting jewel' });
    }
};


module.exports={getJewels,
    getJewelById,
    validateJewel,
    createJewel,
    updateJewel,
    deleteJewel
};
