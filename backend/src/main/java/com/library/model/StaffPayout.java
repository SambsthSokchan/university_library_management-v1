package com.library.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_payouts")
public class StaffPayout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @Column(name = "staff_name", nullable = false)
    private String staffName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payout_date", nullable = false)
    private LocalDate payoutDate;

    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayoutStatus status = PayoutStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User approvedBy;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PayoutStatus {
        PENDING, PAID, CANCELLED
    }

    public StaffPayout() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getPayoutDate() { return payoutDate; }
    public void setPayoutDate(LocalDate payoutDate) { this.payoutDate = payoutDate; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public PayoutStatus getStatus() { return status; }
    public void setStatus(PayoutStatus status) { this.status = status; }
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class StaffPayoutBuilder {
        private final StaffPayout p = new StaffPayout();
        public StaffPayoutBuilder user(User user) { p.setUser(user); return this; }
        public StaffPayoutBuilder staffName(String name) { p.setStaffName(name); return this; }
        public StaffPayoutBuilder amount(BigDecimal amount) { p.setAmount(amount); return this; }
        public StaffPayoutBuilder payoutDate(LocalDate date) { p.setPayoutDate(date); return this; }
        public StaffPayoutBuilder note(String note) { p.setNote(note); return this; }
        public StaffPayoutBuilder status(PayoutStatus status) { p.setStatus(status); return this; }
        public StaffPayoutBuilder approvedBy(User admin) { p.setApprovedBy(admin); return this; }
        public StaffPayout build() { return p; }
    }

    public static StaffPayoutBuilder builder() {
        return new StaffPayoutBuilder();
    }
}
