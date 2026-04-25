package com.library.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "income_transactions")
public class IncomeTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncomeSource source;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    private String description;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User receivedBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum IncomeSource {
        THESIS, OTHER
    }

    public IncomeTransaction() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public IncomeSource getSource() { return source; }
    public void setSource(IncomeSource source) { this.source = source; }
    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    public User getReceivedBy() { return receivedBy; }
    public void setReceivedBy(User receivedBy) { this.receivedBy = receivedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class IncomeTransactionBuilder {
        private final IncomeTransaction t = new IncomeTransaction();
        public IncomeTransactionBuilder source(IncomeSource source) { t.setSource(source); return this; }
        public IncomeTransactionBuilder referenceId(Long id) { t.setReferenceId(id); return this; }
        public IncomeTransactionBuilder amount(BigDecimal amount) { t.setAmount(amount); return this; }
        public IncomeTransactionBuilder description(String desc) { t.setDescription(desc); return this; }
        public IncomeTransactionBuilder transactionDate(LocalDate date) { t.setTransactionDate(date); return this; }
        public IncomeTransactionBuilder receivedBy(User user) { t.setReceivedBy(user); return this; }
        public IncomeTransaction build() { return t; }
    }

    public static IncomeTransactionBuilder builder() {
        return new IncomeTransactionBuilder();
    }
}
