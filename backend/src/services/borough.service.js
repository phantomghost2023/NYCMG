const { Borough } = require('../models');
const { getCachedBoroughs, setCachedBoroughs, clearBoroughsCache } = require('./cache.service');

const getAllBoroughs = async () => {
  try {
    // Check cache first
    let boroughs = getCachedBoroughs();
    if (boroughs) {
      return boroughs;
    }
    
    // If not in cache, fetch from database with optimized query
    boroughs = await Borough.findAll({
      attributes: ['id', 'name', 'description', 'created_at', 'updated_at'], // Only necessary fields
      order: [['created_at', 'ASC']],
      logging: false // Disable logging in production for better performance
    });
    
    // Cache the result
    setCachedBoroughs(boroughs);
    
    return boroughs;
  } catch (error) {
    throw new Error(`Failed to fetch boroughs: ${error.message}`);
  }
};

const getBoroughById = async (id) => {
  try {
    const borough = await Borough.findByPk(id, {
      attributes: ['id', 'name', 'description', 'created_at', 'updated_at'], // Only necessary fields
      logging: false // Disable logging in production for better performance
    });
    
    if (!borough) {
      throw new Error('Borough not found');
    }
    
    return borough;
  } catch (error) {
    throw new Error(`Failed to fetch borough: ${error.message}`);
  }
};

const createBorough = async (boroughData) => {
  try {
    const borough = await Borough.create(boroughData);
    
    // Clear boroughs cache when a new borough is created
    clearBoroughsCache();
    
    return borough;
  } catch (error) {
    throw new Error(`Failed to create borough: ${error.message}`);
  }
};

const updateBorough = async (id, updateData) => {
  try {
    const borough = await Borough.findByPk(id);
    
    if (!borough) {
      throw new Error('Borough not found');
    }
    
    const updatedBorough = await borough.update(updateData);
    
    // Clear boroughs cache when a borough is updated
    clearBoroughsCache();
    
    return updatedBorough;
  } catch (error) {
    throw new Error(`Failed to update borough: ${error.message}`);
  }
};

const deleteBorough = async (id) => {
  try {
    const borough = await Borough.findByPk(id);
    
    if (!borough) {
      throw new Error('Borough not found');
    }
    
    await borough.destroy();
    
    // Clear boroughs cache when a borough is deleted
    clearBoroughsCache();
    
    return { message: 'Borough deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete borough: ${error.message}`);
  }
};

module.exports = {
  getAllBoroughs,
  getBoroughById,
  createBorough,
  updateBorough,
  deleteBorough
};