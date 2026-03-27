package com.library.service;

import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.model.Fine;
import com.library.model.Member;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.FineRepository;
import com.library.repository.MemberRepository;
import com.library.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BorrowService {

    private final BorrowRecordRepository borrowRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final FineRepository fineRepository;
    private final UserRepository userRepository;

    public BorrowService(BorrowRecordRepository borrowRepository, BookRepository bookRepository, 
                         MemberRepository memberRepository, FineRepository fineRepository, 
                         UserRepository userRepository) {
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.fineRepository = fineRepository;
        this.userRepository = userRepository;
    }

    public List<BorrowRecord> getAllRecords() {
        return borrowRepository.findAll();
    }

    public List<BorrowRecord> getMemberRecords(Long memberId) {
        return borrowRepository.findByMemberId(memberId);
    }

    @Transactional
    public BorrowRecord borrowBook(Long bookId, Long memberId) {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));

        if (book.getAvailableQuantity() <= 0) {
            throw new RuntimeException("Book out of stock");
        }

        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User issuer = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Issuer not found"));

        BorrowRecord record = BorrowRecord.builder()
                .book(book)
                .member(member)
                .borrowDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(14))
                .issuedBy(issuer)
                .build();

        return borrowRepository.save(record);
    }

    @Transactional
    public BorrowRecord returnBook(Long recordId) {
        BorrowRecord record = borrowRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (record.getStatus() == BorrowRecord.Status.RETURNED) {
            throw new RuntimeException("Book already returned");
        }

        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowRecord.Status.RETURNED);

        Book book = record.getBook();
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);
        bookRepository.save(book);

        // Calculate fine if overdue
        if (record.getReturnDate().isAfter(record.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), record.getReturnDate());
            if (daysOverdue > 0) {
                Fine fine = Fine.builder()
                        .borrowRecord(record)
                        .member(record.getMember())
                        .amount(new BigDecimal(daysOverdue * 10)) // 10 per day
                        .build();
                fineRepository.save(fine);
            }
        }

        return borrowRepository.save(record);
    }
}
