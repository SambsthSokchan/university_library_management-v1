package com.library.controller;

import com.library.model.ThesisInvoice;
import com.library.service.ThesisInvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thesis-invoices")
public class ThesisInvoiceController {

    private final ThesisInvoiceService invoiceService;

    public ThesisInvoiceController(ThesisInvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public List<ThesisInvoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @PostMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ThesisInvoice createInvoice(@PathVariable Long memberId, @RequestBody ThesisInvoice invoice) {
        return invoiceService.createInvoice(memberId, invoice);
    }

    @PostMapping("/pay/{invoiceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ThesisInvoice> payInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(invoiceService.payInvoice(invoiceId));
    }
}
