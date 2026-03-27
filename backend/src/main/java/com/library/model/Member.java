package com.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true)
    private String email;

    private String phone;

    @Column(unique = true)
    private String studentId;

    @Enumerated(EnumType.STRING)
    private MemberType memberType;

    private String department;

    private Boolean isActive = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum MemberType {
        STUDENT, STAFF
    }

    public Member() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public MemberType getMemberType() { return memberType; }
    public void setMemberType(MemberType memberType) { this.memberType = memberType; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class MemberBuilder {
        private final Member member = new Member();
        public MemberBuilder id(Long id) { member.setId(id); return this; }
        public MemberBuilder fullName(String fullName) { member.setFullName(fullName); return this; }
        public MemberBuilder studentId(String studentId) { member.setStudentId(studentId); return this; }
        public Member build() { return member; }
    }

    public static MemberBuilder builder() {
        return new MemberBuilder();
    }
}
