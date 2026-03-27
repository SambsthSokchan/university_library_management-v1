package com.library.repository;

import com.library.model.ClearanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClearanceRequestRepository extends JpaRepository<ClearanceRequest, Long> {
    List<ClearanceRequest> findByMemberId(Long memberId);
    List<ClearanceRequest> findByStatus(ClearanceRequest.ClearanceStatus status);
    List<ClearanceRequest> findByMemberIdAndStatus(Long memberId, ClearanceRequest.ClearanceStatus status);
    boolean existsByMemberIdAndStatus(Long memberId, ClearanceRequest.ClearanceStatus status);
}
