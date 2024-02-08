using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Helpers;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Controllers;

public class MessagesController: BaseAPIController
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public MessagesController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<MemberDTO>> CreateMessage(CreateMessageDTO createMessageDto)
    {
        var username = User.GetUserName();
        if (username == createMessageDto.RecipientUsername.ToLower())
        {
            return BadRequest("You can't send messages to yourself");
        }

        var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
        
        if(recipient == null) NotFound();

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content
        };
        
        _unitOfWork.MessageRepository.AddMessage(message);
        
        if(await _unitOfWork.Complete()) return Ok(_mapper.Map<MessageDTO>(message));

        return BadRequest("Failed to send message");
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<MessageDTO>>> GetMessagesForUser(
        [FromQuery] MessageParams messageParams)
    {
        messageParams.Username = User.GetUserName();
        var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);
        Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage, messages.PageSize, 
            messages.TotalCount, messages.TotalPages));

        return messages;
    }

    // [HttpGet("thread/{username}")]
    // public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string username)
    // {
    //     var currentUsername = User.GetUserName();
    //     return Ok(await _unitOfWork.MessageRepository.GetMessageThread(currentUsername, username));
    // }
    
    [HttpDelete("{id}")]
    //both users need to delete the message for it to fully delete
    public async Task<ActionResult> DeleteMessage(int id)
    {
        var username = User.GetUserName();
        var message = await _unitOfWork.MessageRepository.GetMessage(id);
        //verify the user is either the sender or recipient
        if (message.SenderUsername != username && message.RecipientUsername != username)
            return Unauthorized("Not the sender or recipient of message");

        if (message.SenderUsername == username) message.SenderDeleted = true;
        if (message.RecipientUsername == username) message.RecipientDeleted = true;

        if (message.SenderDeleted && message.RecipientDeleted)
        {
            _unitOfWork.MessageRepository.DeleteMessage(message);
        }
        
        if(await _unitOfWork.Complete()) return Ok();

        return BadRequest("Problem Deleting the message");

    }
}