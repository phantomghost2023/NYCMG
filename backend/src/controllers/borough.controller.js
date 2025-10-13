const { 
  getAllBoroughs, 
  getBoroughById, 
  createBorough, 
  updateBorough, 
  deleteBorough 
} = require('../services/borough.service');

const listBoroughs = async (req, res) => {
  try {
    const boroughs = await getAllBoroughs();
    res.json(boroughs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBorough = async (req, res) => {
  try {
    const borough = await getBoroughById(req.params.id);
    res.json(borough);
  } catch (error) {
    if (error.message === 'Borough not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const borough = await createBorough(req.body);
    res.status(201).json(borough);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const borough = await updateBorough(req.params.id, req.body);
    res.json(borough);
  } catch (error) {
    if (error.message === 'Borough not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteBorough(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Borough not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listBoroughs,
  getBorough,
  create,
  update,
  remove
};