using AutoMapper;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;

namespace TeborawAPI.Helpers;

public class AutoMapperProfiles: Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDTO>()
            .ForMember(dest => dest.PhotoUrl, opt => opt
                .MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(dest => dest.Age, opt => opt
                .MapFrom(src => src.DateOfBirth.CalculateAge()));
        CreateMap<Photo, PhotoDTO>();
        CreateMap<MemberUpdateDTO, AppUser>();
        CreateMap<RegisterDTO, AppUser>();
        
        //map additional photo url of the send and recievers to the dto 
        CreateMap<Message, MessageDTO>()
            .ForMember(d=> d.SenderPhotoUrl, opt => opt
                .MapFrom(s => s.Sender.Photos.FirstOrDefault(x =>x.IsMain).Url))
            .ForMember(d=> d.RecipientPhotoUrl, opt => opt
                .MapFrom(s => s.Recipient.Photos.FirstOrDefault(x =>x.IsMain).Url));
        
        
    }
}