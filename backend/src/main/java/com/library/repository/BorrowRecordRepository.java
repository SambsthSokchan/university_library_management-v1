package com.library.repository;

import com.library.model.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByMemberId(Long memberId);
    
    List<BorrowRecord> findByStatus(BorrowRecord.Status status);
    List<BorrowRecord> findByStatusAndDueDateBefore(BorrowRecord.Status status, LocalDate date);

    long countByStatus(BorrowRecord.Status status);

    @Query("SELECT b FROM BorrowRecord b WHERE b.status = 'BORROWED' AND b.dueDate < :today")
    List<BorrowRecord> findOverdue(@Param("today") LocalDate today);

    @Query("SELECT COUNT(b) FROM BorrowRecord b WHERE b.member.id = :memberId AND b.status = 'BORROWED'")
    long countActiveBorrowsByMember(@Param("memberId") Long memberId);

    @Query("SELECT b FROM BorrowRecord b WHERE b.member.id = :memberId AND b.status = 'BORROWED'")
    List<BorrowRecord> findActiveBorrowsByMember(@Param("memberId") Long memberId);
}
