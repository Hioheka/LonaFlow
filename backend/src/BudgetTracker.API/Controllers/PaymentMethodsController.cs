using System.Security.Claims;
using BudgetTracker.Core.DTOs.PaymentMethod;
using BudgetTracker.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentMethodsController : ControllerBase
{
    private readonly IPaymentMethodService _paymentMethodService;

    public PaymentMethodsController(IPaymentMethodService paymentMethodService)
    {
        _paymentMethodService = paymentMethodService;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var paymentMethods = await _paymentMethodService.GetAllAsync(GetUserId());
        return Ok(paymentMethods);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var paymentMethod = await _paymentMethodService.GetByIdAsync(GetUserId(), id);
        if (paymentMethod == null) return NotFound();
        return Ok(paymentMethod);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaymentMethodDto dto)
    {
        var paymentMethod = await _paymentMethodService.CreateAsync(GetUserId(), dto);
        return CreatedAtAction(nameof(GetById), new { id = paymentMethod.Id }, paymentMethod);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePaymentMethodDto dto)
    {
        try
        {
            var paymentMethod = await _paymentMethodService.UpdateAsync(GetUserId(), id, dto);
            return Ok(paymentMethod);
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _paymentMethodService.DeleteAsync(GetUserId(), id);
        if (!result) return NotFound();
        return NoContent();
    }
}
