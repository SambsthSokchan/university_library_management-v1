package com.library.service;

import com.library.model.ClearanceRequest;
import com.library.model.Member;
import com.library.model.User;
import com.library.repository.ClearanceRequestRepository;
import com.library.repository.MemberRepository;
import com.library.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClearanceService {

    private final ClearanceRequestRepository clearanceRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;

    public ClearanceService(ClearanceRequestRepository clearanceRepository, 
                            MemberRepository memberRepository, UserRepository userRepository) {
        this.clearanceRepository = clearanceRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    public List<ClearanceRequest> getAllRequests() {
        return clearanceRepository.findAll();
    }

    public ClearanceRequest requestClearance(Long memberId, String reason) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        ClearanceRequest request = new ClearanceRequest();
        request.setMember(member);
        request.setReason(reason);
        return clearanceRepository.save(request);
    }

    @Transactional
    public ClearanceRequest reviewRequest(Long requestId, ClearanceRequest.ClearanceStatus status, String note) {
        ClearanceRequest request = clearanceRepository.findById(requestId).orElseThrow();
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByUsername(username).orElseThrow();

        request.setStatus(status);
        request.setNote(note);
        request.setReviewedBy(admin);
        request.setReviewedAt(LocalDateTime.now());

        return clearanceRepository.save(request);
    }
}
