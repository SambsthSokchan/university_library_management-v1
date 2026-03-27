package com.library.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "clearance_requests")
public class ClearanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Member member;

    private String reason;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClearanceStatus status = ClearanceStatus.PENDING;

    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ClearanceStatus {
        PENDING, APPROVED, REJECTED
    }

    public ClearanceRequest() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDate requestDate) { this.requestDate = requestDate; }
    public ClearanceStatus getStatus() { return status; }
    public void setStatus(ClearanceStatus status) { this.status = status; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public User getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(User reviewedBy) { this.reviewedBy = reviewedBy; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class ClearanceRequestBuilder {
        private final ClearanceRequest r = new ClearanceRequest();
        public ClearanceRequestBuilder member(Member m) { r.setMember(m); return this; }
        public ClearanceRequestBuilder reason(String reason) { r.setReason(reason); return this; }
        public ClearanceRequestBuilder requestDate(LocalDate date) { r.setRequestDate(date); return this; }
        public ClearanceRequestBuilder status(ClearanceStatus s) { r.setStatus(s); return this; }
        public ClearanceRequestBuilder reviewedBy(User admin) { r.setReviewedBy(admin); return this; }
        public ClearanceRequest build() { return r; }
    }

    public static ClearanceRequestBuilder builder() {
        return new ClearanceRequestBuilder();
    }
}
