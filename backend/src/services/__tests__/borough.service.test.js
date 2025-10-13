// Mock the models
jest.mock('../../models', () => {
  const mockBorough = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };
  
  return {
    Borough: mockBorough
  };
});

// Mock the cache service
jest.mock('../cache.service', () => {
  return {
    getCachedBoroughs: jest.fn(),
    setCachedBoroughs: jest.fn(),
    clearBoroughsCache: jest.fn()
  };
});

// Import the actual service functions
const boroughService = require('../borough.service');
const { Borough } = require('../../models');
const { 
  getCachedBoroughs, 
  setCachedBoroughs, 
  clearBoroughsCache 
} = require('../cache.service');

describe('Borough Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllBoroughs', () => {
    it('should return cached boroughs when available', async () => {
      const cachedBoroughs = [
        { id: 1, name: 'Manhattan', description: 'The heart of NYC' },
        { id: 2, name: 'Brooklyn', description: 'The borough of hipsters' }
      ];
      
      getCachedBoroughs.mockReturnValue(cachedBoroughs);

      const result = await boroughService.getAllBoroughs();
      
      expect(getCachedBoroughs).toHaveBeenCalled();
      expect(result).toEqual(cachedBoroughs);
    });

    it('should fetch boroughs from database when not cached', async () => {
      getCachedBoroughs.mockReturnValue(null);
      
      const mockBoroughs = [
        { id: 1, name: 'Manhattan', description: 'The heart of NYC' },
        { id: 2, name: 'Brooklyn', description: 'The borough of hipsters' }
      ];
      
      Borough.findAll.mockResolvedValue(mockBoroughs);

      const result = await boroughService.getAllBoroughs();
      
      expect(Borough.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: ['id', 'name', 'description', 'created_at', 'updated_at'],
          order: [['created_at', 'ASC']]
        })
      );
      expect(setCachedBoroughs).toHaveBeenCalledWith(mockBoroughs);
      expect(result).toEqual(mockBoroughs);
    });
  });

  describe('getBoroughById', () => {
    it('should fetch borough by ID from database', async () => {
      const boroughId = '1';
      const mockBorough = { id: boroughId, name: 'Manhattan', description: 'The heart of NYC' };
      
      Borough.findByPk.mockResolvedValue(mockBorough);

      const result = await boroughService.getBoroughById(boroughId);
      
      expect(Borough.findByPk).toHaveBeenCalledWith(
        boroughId,
        expect.objectContaining({
          attributes: ['id', 'name', 'description', 'created_at', 'updated_at']
        })
      );
      expect(result).toEqual(mockBorough);
    });

    it('should throw error when borough is not found', async () => {
      const boroughId = 'nonexistent';
      
      Borough.findByPk.mockResolvedValue(null);
      
      await expect(boroughService.getBoroughById(boroughId)).rejects.toThrow('Borough not found');
    });
  });

  describe('createBorough', () => {
    it('should create a new borough successfully', async () => {
      const boroughData = {
        name: 'Queens',
        description: 'The most diverse borough'
      };
      
      const mockCreatedBorough = { 
        id: '3', 
        ...boroughData,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      Borough.create.mockResolvedValue(mockCreatedBorough);

      const result = await boroughService.createBorough(boroughData);
      
      expect(Borough.create).toHaveBeenCalledWith(boroughData);
      expect(clearBoroughsCache).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedBorough);
    });
  });

  describe('updateBorough', () => {
    it('should update a borough successfully', async () => {
      const boroughId = '1';
      const updateData = { name: 'Updated Manhattan' };
      
      // Mock borough exists
      const mockBorough = { 
        id: boroughId, 
        name: 'Manhattan',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties
          return Promise.resolve({ 
            id: this.id, 
            name: updateData.name || this.name
          });
        })
      };
      Borough.findByPk.mockResolvedValue(mockBorough);

      const result = await boroughService.updateBorough(boroughId, updateData);
      
      expect(Borough.findByPk).toHaveBeenCalledWith(boroughId);
      expect(mockBorough.update).toHaveBeenCalledWith(updateData);
      expect(clearBoroughsCache).toHaveBeenCalled();
      expect(result).toEqual({ id: boroughId, name: 'Updated Manhattan' });
    });

    it('should throw error when borough is not found', async () => {
      const boroughId = 'nonexistent';
      const updateData = { name: 'Updated Borough' };
      
      Borough.findByPk.mockResolvedValue(null);
      
      await expect(boroughService.updateBorough(boroughId, updateData)).rejects.toThrow('Borough not found');
    });
  });

  describe('deleteBorough', () => {
    it('should delete a borough successfully', async () => {
      const boroughId = '1';
      
      // Mock borough exists
      const mockBorough = { 
        id: boroughId, 
        name: 'Manhattan',
        destroy: jest.fn().mockResolvedValue()
      };
      Borough.findByPk.mockResolvedValue(mockBorough);

      const result = await boroughService.deleteBorough(boroughId);
      
      expect(Borough.findByPk).toHaveBeenCalledWith(boroughId);
      expect(mockBorough.destroy).toHaveBeenCalled();
      expect(clearBoroughsCache).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Borough deleted successfully' });
    });

    it('should throw error when borough is not found', async () => {
      const boroughId = 'nonexistent';
      
      Borough.findByPk.mockResolvedValue(null);
      
      await expect(boroughService.deleteBorough(boroughId)).rejects.toThrow('Borough not found');
    });
  });
});