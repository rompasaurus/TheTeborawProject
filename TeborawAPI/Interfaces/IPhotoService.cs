using CloudinaryDotNet.Actions;

namespace TeborawAPI.Interfaces;

public interface IPhotoService
{
    Task<ImageUploadResult> AppPhotoAsync(IFormFile file);
    Task<DeletionResult> DeletePhotoAsync(string publicId);
}