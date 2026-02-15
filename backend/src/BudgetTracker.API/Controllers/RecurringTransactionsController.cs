using System.Security.Claims;
using BudgetTracker.Core.DTOs.RecurringTransaction;
using BudgetTracker.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecurringTransactionsController : ControllerBase
{
    private readonly IRecurringTransactionService _recurringService;

    public RecurringTransactionsController(IRecurringTransactionService recurringService)
    {
        _recurringService = recurringService;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var recurring = await _recurringService.GetAllAsync(GetUserId());
        return Ok(recurring);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var recurring = await _recurringService.GetActiveAsync(GetUserId());
        return Ok(recurring);
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingPayments([FromQuery] int? months = null, [FromQuery] int? days = null)
    {
        var upcomingPayments = await _recurringService.GetUpcomingPaymentsAsync(GetUserId(), months, days);
        return Ok(upcomingPayments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var recurring = await _recurringService.GetByIdAsync(GetUserId(), id);
        if (recurring == null) return NotFound();
        return Ok(recurring);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRecurringTransactionDto dto)
    {
        var recurring = await _recurringService.CreateAsync(GetUserId(), dto);
        return CreatedAtAction(nameof(GetById), new { id = recurring.Id }, recurring);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRecurringTransactionDto dto)
    {
        try
        {
            var recurring = await _recurringService.UpdateAsync(GetUserId(), id, dto);
            return Ok(recurring);
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _recurringService.DeleteAsync(GetUserId(), id);
        if (!result) return NotFound();
        return NoContent();
    }
}
