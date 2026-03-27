package com.library.service;

import com.library.model.BorrowRecord;
import com.library.model.Fine;
import com.library.model.IncomeTransaction;
import com.library.model.Member;
import com.library.model.User;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.FineRepository;
import com.library.repository.IncomeTransactionRepository;
import com.library.repository.MemberRepository;
import com.library.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FineService {

    private final FineRepository fineRepository;
    private final UserRepository userRepository;
    private final IncomeTransactionRepository incomeRepository;
    private final BorrowRecordRepository borrowRepository;
    private final MemberRepository memberRepository;

    public FineService(FineRepository fineRepository, UserRepository userRepository, 
                       IncomeTransactionRepository incomeRepository,
                       BorrowRecordRepository borrowRepository,
                       MemberRepository memberRepository) {
        this.fineRepository = fineRepository;
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.borrowRepository = borrowRepository;
        this.memberRepository = memberRepository;
    }

    public List<Fine> getAllFines() {
        return fineRepository.findAll();
    }

    public List<Fine> getMemberFines(Long memberId) {
        return fineRepository.findByMemberId(memberId);
    }

    @Transactional
    public Fine createFine(Long borrowId, Long memberId, BigDecimal amount) {
        BorrowRecord borrow = borrowRepository.findById(borrowId).orElseThrow();
        Member member = memberRepository.findById(memberId).orElseThrow();
        
        Fine fine = Fine.builder()
                .borrowRecord(borrow)
                .member(member)
                .amount(amount)
                .build();
        return fineRepository.save(fine);
    }

    @Transactional
    public Fine payFine(Long fineId) {
        Fine fine = fineRepository.findById(fineId).orElseThrow();

        if (fine.getPaid()) {
            throw new RuntimeException("Fine already paid");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByUsername(username).orElseThrow();

        fine.setPaid(true);
        fine.setPaidAt(LocalDateTime.now());
        fine.setCollectedBy(admin);
        fineRepository.save(fine);

        // Record income
        incomeRepository.save(IncomeTransaction.builder()
                .source(IncomeTransaction.IncomeSource.FINE)
                .referenceId(fine.getId())
                .amount(fine.getAmount())
                .description("Fine payment for member: " + fine.getMember().getFullName())
                .build());

        return fine;
    }
}
