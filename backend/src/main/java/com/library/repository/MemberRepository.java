package com.library.repository;

import com.library.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByStudentId(String studentId);
    Optional<Member> findByEmail(String email);
    List<Member> findByFullNameContainingIgnoreCaseOrStudentIdContainingIgnoreCase(String name, String studentId);
}
