package com.library.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fines")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrow_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private BorrowRecord borrowRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Member member;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    private Boolean paid = false;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collected_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User collectedBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Fine() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BorrowRecord getBorrowRecord() { return borrowRecord; }
    public void setBorrowRecord(BorrowRecord borrowRecord) { this.borrowRecord = borrowRecord; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Boolean getPaid() { return paid; }
    public void setPaid(Boolean paid) { this.paid = paid; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public User getCollectedBy() { return collectedBy; }
    public void setCollectedBy(User collectedBy) { this.collectedBy = collectedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class FineBuilder {
        private final Fine fine = new Fine();
        public FineBuilder borrowRecord(BorrowRecord record) { fine.setBorrowRecord(record); return this; }
        public FineBuilder member(Member member) { fine.setMember(member); return this; }
        public FineBuilder amount(BigDecimal amount) { fine.setAmount(amount); return this; }
        public Fine build() { return fine; }
    }

    public static FineBuilder builder() {
        return new FineBuilder();
    }
}
