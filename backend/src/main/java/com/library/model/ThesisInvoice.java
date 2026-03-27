package com.library.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "thesis_invoices")
public class ThesisInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Member member;

    private String thesisTitle;
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.UNPAID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User issuedBy;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        UNPAID, PAID, CANCELLED
    }

    public ThesisInvoice() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public String getThesisTitle() { return thesisTitle; }
    public void setThesisTitle(String thesisTitle) { this.thesisTitle = thesisTitle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public User getIssuedBy() { return issuedBy; }
    public void setIssuedBy(User issuedBy) { this.issuedBy = issuedBy; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class ThesisInvoiceBuilder {
        private final ThesisInvoice i = new ThesisInvoice();
        public ThesisInvoiceBuilder invoiceNumber(String num) { i.setInvoiceNumber(num); return this; }
        public ThesisInvoiceBuilder member(Member m) { i.setMember(m); return this; }
        public ThesisInvoiceBuilder thesisTitle(String title) { i.setThesisTitle(title); return this; }
        public ThesisInvoiceBuilder description(String desc) { i.setDescription(desc); return this; }
        public ThesisInvoiceBuilder amount(BigDecimal amount) { i.setAmount(amount); return this; }
        public ThesisInvoiceBuilder status(Status s) { i.setStatus(s); return this; }
        public ThesisInvoiceBuilder issuedBy(User user) { i.setIssuedBy(user); return this; }
        public ThesisInvoice build() { return i; }
    }

    public static ThesisInvoiceBuilder builder() {
        return new ThesisInvoiceBuilder();
    }
}
