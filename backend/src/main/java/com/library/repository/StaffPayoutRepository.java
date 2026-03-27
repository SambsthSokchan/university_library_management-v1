package com.library.repository;

import com.library.model.StaffPayout;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StaffPayoutRepository extends JpaRepository<StaffPayout, Long> {
    List<StaffPayout> findByUserId(Long userId);
    List<StaffPayout> findByStatus(StaffPayout.PayoutStatus status);
}
