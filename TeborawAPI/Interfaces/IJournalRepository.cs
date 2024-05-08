using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Helpers;
using TeborawAPI.Models;

namespace TeborawAPI.Interfaces;

public interface IJournalRepository
{
    Task<JournalRaw> getLatestJournalRaw(string userId);
    Task<List<JournalRaw>> getUserJournalListRaw(string userId);
}