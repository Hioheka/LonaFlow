using System.Security.Claims;
using BudgetTracker.Core.DTOs.Transaction;
using BudgetTracker.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var transactions = await _transactionService.GetAllAsync(GetUserId());
        return Ok(transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var transaction = await _transactionService.GetByIdAsync(GetUserId(), id);
        if (transaction == null) return NotFound();
        return Ok(transaction);
    }

    [HttpGet("date-range")]
    public async Task<IActionResult> GetByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var transactions = await _transactionService.GetByDateRangeAsync(GetUserId(), startDate, endDate);
        return Ok(transactions);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
    {
        var transaction = await _transactionService.CreateAsync(GetUserId(), dto);
        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTransactionDto dto)
    {
        try
        {
            var transaction = await _transactionService.UpdateAsync(GetUserId(), id, dto);
            return Ok(transaction);
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _transactionService.DeleteAsync(GetUserId(), id);
        if (!result) return NotFound();
        return NoContent();
    }
}
