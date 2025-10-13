const fileUploadService = require('../fileUpload.service');

describe('File Upload Service', () => {
  test('should create upload middleware functions', () => {
    expect(typeof fileUploadService.uploadSingleFile).toBe('function');
    expect(typeof fileUploadService.uploadMultipleFiles).toBe('function');
    expect(typeof fileUploadService.uploadMixedFiles).toBe('function');
  });

  test('should create file URL', () => {
    const filename = 'test-file.mp3';
    const url = fileUploadService.getFileUrl(filename);
    expect(url).toBe(`/uploads/${filename}`);
  });
});