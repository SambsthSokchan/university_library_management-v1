package com.library.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_records")
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User issuedBy;

    @Column(nullable = false)
    private LocalDate borrowDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.BORROWED;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        BORROWED, RETURNED, OVERDUE
    }

    public BorrowRecord() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public User getIssuedBy() { return issuedBy; }
    public void setIssuedBy(User issuedBy) { this.issuedBy = issuedBy; }
    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class BorrowRecordBuilder {
        private final BorrowRecord record = new BorrowRecord();
        public BorrowRecordBuilder book(Book book) { record.setBook(book); return this; }
        public BorrowRecordBuilder member(Member member) { record.setMember(member); return this; }
        public BorrowRecordBuilder borrowDate(LocalDate date) { record.setBorrowDate(date); return this; }
        public BorrowRecordBuilder dueDate(LocalDate date) { record.setDueDate(date); return this; }
        public BorrowRecordBuilder issuedBy(User user) { record.setIssuedBy(user); return this; }
        public BorrowRecordBuilder status(Status status) { record.setStatus(status); return this; }
        public BorrowRecord build() { return record; }
    }

    public static BorrowRecordBuilder builder() {
        return new BorrowRecordBuilder();
    }
}
