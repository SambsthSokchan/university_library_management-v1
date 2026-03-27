package com.library.service;

import com.library.model.IncomeTransaction;
import com.library.model.Member;
import com.library.model.ThesisInvoice;
import com.library.repository.IncomeTransactionRepository;
import com.library.repository.MemberRepository;
import com.library.repository.ThesisInvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ThesisInvoiceService {

    private final ThesisInvoiceRepository invoiceRepository;
    private final MemberRepository memberRepository;
    private final IncomeTransactionRepository incomeRepository;

    public ThesisInvoiceService(ThesisInvoiceRepository invoiceRepository, MemberRepository memberRepository, 
                                IncomeTransactionRepository incomeRepository) {
        this.invoiceRepository = invoiceRepository;
        this.memberRepository = memberRepository;
        this.incomeRepository = incomeRepository;
    }

    public List<ThesisInvoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public ThesisInvoice createInvoice(Long memberId, ThesisInvoice invoice) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
        invoice.setMember(member);
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setStatus(ThesisInvoice.Status.UNPAID);
        return invoiceRepository.save(invoice);
    }

    @Transactional
    public ThesisInvoice payInvoice(Long invoiceId) {
        ThesisInvoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (invoice.getStatus() == ThesisInvoice.Status.PAID) {
            throw new RuntimeException("Invoice already paid");
        }

        invoice.setStatus(ThesisInvoice.Status.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        invoiceRepository.save(invoice);

        // Record income
        incomeRepository.save(IncomeTransaction.builder()
                .source(IncomeTransaction.IncomeSource.THESIS)
                .referenceId(invoice.getId())
                .amount(invoice.getAmount())
                .description("Thesis payment for: " + invoice.getMember().getFullName())
                .build());

        return invoice;
    }
}
