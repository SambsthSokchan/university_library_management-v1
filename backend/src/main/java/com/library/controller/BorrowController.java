package com.library.controller;

import com.library.model.*;
import com.library.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    private final BorrowRecordRepository borrowRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final FineRepository fineRepository;

    public BorrowController(BorrowRecordRepository borrowRepository, BookRepository bookRepository, 
                            MemberRepository memberRepository, UserRepository userRepository, 
                            FineRepository fineRepository) {
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.fineRepository = fineRepository;
    }

    // GET all borrow records
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<BorrowRecord> getAllBorrows() {
        return borrowRepository.findAll();
    }

    // GET active borrows
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<BorrowRecord> getActiveBorrows() {
        return borrowRepository.findByStatus(BorrowRecord.Status.BORROWED);
    }

    // GET overdue borrows
    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<BorrowRecord> getOverdueBorrows() {
        return borrowRepository.findByStatusAndDueDateBefore(
                BorrowRecord.Status.BORROWED, LocalDate.now());
    }

    // POST borrow a book
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> borrowBook(@RequestBody BorrowRequest request, Authentication auth) {
        Book book = bookRepository.findById(request.getBookId()).orElse(null);
        Member member = memberRepository.findById(request.getMemberId()).orElse(null);
        User staff = userRepository.findByUsername(auth.getName()).orElse(null);

        if (book == null || member == null) {
            return ResponseEntity.badRequest().body("Book or Member not found");
        }

        if (book.getAvailableQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Book is not available");
        }

        // Decrease available quantity
        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);

        BorrowRecord record = BorrowRecord.builder()
                .book(book)
                .member(member)
                .issuedBy(staff)
                .borrowDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(14)) // 14 days default
                .status(BorrowRecord.Status.BORROWED)
                .build();

        return ResponseEntity.ok(borrowRepository.save(record));
    }

    // PUT return a book
    @PutMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> returnBook(@PathVariable Long id) {
        BorrowRecord record = borrowRepository.findById(id).orElse(null);

        if (record == null) {
            return ResponseEntity.notFound().build();
        }

        if (record.getStatus() == BorrowRecord.Status.RETURNED) {
            return ResponseEntity.badRequest().body("Book already returned");
        }

        // Update record
        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowRecord.Status.RETURNED);
        borrowRepository.save(record);

        // Increase available quantity
        Book book = record.getBook();
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);
        bookRepository.save(book);

        // Check if overdue & create fine (1$ per day late)
        if (LocalDate.now().isAfter(record.getDueDate())) {
            long daysLate = LocalDate.now().toEpochDay() - record.getDueDate().toEpochDay();
            double fineAmount = daysLate * 1.0;

            Fine fine = Fine.builder()
                    .borrowRecord(record)
                    .member(record.getMember())
                    .amount(java.math.BigDecimal.valueOf(fineAmount))
                    .build();
            fineRepository.save(fine);

            return ResponseEntity.ok("Book returned with fine: $" + fineAmount);
        }

        return ResponseEntity.ok("Book returned successfully");
    }

    public static class BorrowRequest {
        private Long bookId;
        private Long memberId;

        public BorrowRequest() {}

        public Long getBookId() { return bookId; }
        public void setBookId(Long bookId) { this.bookId = bookId; }
        public Long getMemberId() { return memberId; }
        public void setMemberId(Long memberId) { this.memberId = memberId; }
    }
}
