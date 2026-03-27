package com.library.repository;

import com.library.model.ThesisInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ThesisInvoiceRepository extends JpaRepository<ThesisInvoice, Long> {
    List<ThesisInvoice> findByMemberId(Long memberId);
    List<ThesisInvoice> findByStatus(ThesisInvoice.Status status);
}
