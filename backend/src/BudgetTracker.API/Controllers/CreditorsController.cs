using System.Security.Claims;
using BudgetTracker.Core.DTOs.Creditor;
using BudgetTracker.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CreditorsController : ControllerBase
{
    private readonly ICreditorService _creditorService;

    public CreditorsController(ICreditorService creditorService)
    {
        _creditorService = creditorService;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var creditors = await _creditorService.GetAllAsync(GetUserId());
        return Ok(creditors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var creditor = await _creditorService.GetByIdAsync(GetUserId(), id);
        if (creditor == null) return NotFound();
        return Ok(creditor);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCreditorDto dto)
    {
        var creditor = await _creditorService.CreateAsync(GetUserId(), dto);
        return CreatedAtAction(nameof(GetById), new { id = creditor.Id }, creditor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCreditorDto dto)
    {
        try
        {
            var creditor = await _creditorService.UpdateAsync(GetUserId(), id, dto);
            return Ok(creditor);
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _creditorService.DeleteAsync(GetUserId(), id);
        if (!result) return NotFound();
        return NoContent();
    }
}
