package com.library.repository;

import com.library.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findByMemberId(Long memberId);
    List<Fine> findByMemberIdAndPaid(Long memberId, Boolean paid);

    @Query("SELECT SUM(f.amount) FROM Fine f WHERE f.member.id = :memberId AND f.paid = false")
    BigDecimal sumUnpaidByMember(@Param("memberId") Long memberId);

    @Query("SELECT COUNT(f) FROM Fine f WHERE f.member.id = :memberId AND f.paid = false")
    long countUnpaidByMember(@Param("memberId") Long memberId);
}
