package com.library.controller;

import com.library.model.Member;
import com.library.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberRepository memberRepository;

    public MemberController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<Member> getAllMembers(@RequestParam(required = false) String query) {
        if (query == null || query.isEmpty()) {
            return memberRepository.findAll();
        }
        return memberRepository.findByFullNameContainingIgnoreCaseOrStudentIdContainingIgnoreCase(query, query);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return memberRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public Member createMember(@RequestBody Member member) {
        return memberRepository.save(member);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member memberDetails) {
        return memberRepository.findById(id).map(member -> {
            member.setFullName(memberDetails.getFullName());
            member.setEmail(memberDetails.getEmail());
            member.setPhone(memberDetails.getPhone());
            member.setStudentId(memberDetails.getStudentId());
            member.setMemberType(memberDetails.getMemberType());
            member.setDepartment(memberDetails.getDepartment());
            member.setIsActive(memberDetails.getIsActive());
            return ResponseEntity.ok(memberRepository.save(member));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        if (!memberRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        memberRepository.deleteById(id);
        return ResponseEntity.ok("Member deleted successfully");
    }
}
