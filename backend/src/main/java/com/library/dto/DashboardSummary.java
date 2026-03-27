package com.library.dto;

import java.math.BigDecimal;

public class DashboardSummary {
    private long totalBooks;
    private long totalMembers;
    private long activeBorrows;
    private long overdueBorrows;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
    private long pendingClearances;

    public DashboardSummary() {}

    // Getters and Setters
    public long getTotalBooks() { return totalBooks; }
    public void setTotalBooks(long totalBooks) { this.totalBooks = totalBooks; }
    public long getTotalMembers() { return totalMembers; }
    public void setTotalMembers(long totalMembers) { this.totalMembers = totalMembers; }
    public long getActiveBorrows() { return activeBorrows; }
    public void setActiveBorrows(long activeBorrows) { this.activeBorrows = activeBorrows; }
    public long getOverdueBorrows() { return overdueBorrows; }
    public void setOverdueBorrows(long overdueBorrows) { this.overdueBorrows = overdueBorrows; }
    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }
    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }
    public BigDecimal getNetBalance() { return netBalance; }
    public void setNetBalance(BigDecimal netBalance) { this.netBalance = netBalance; }
    public long getPendingClearances() { return pendingClearances; }
    public void setPendingClearances(long pendingClearances) { this.pendingClearances = pendingClearances; }

    public static class DashboardSummaryBuilder {
        private final DashboardSummary s = new DashboardSummary();
        public DashboardSummaryBuilder totalBooks(long n) { s.setTotalBooks(n); return this; }
        public DashboardSummaryBuilder totalMembers(long n) { s.setTotalMembers(n); return this; }
        public DashboardSummaryBuilder activeBorrows(long n) { s.setActiveBorrows(n); return this; }
        public DashboardSummaryBuilder overdueBorrows(long n) { s.setOverdueBorrows(n); return this; }
        public DashboardSummaryBuilder totalIncome(BigDecimal b) { s.setTotalIncome(b); return this; }
        public DashboardSummaryBuilder totalExpenses(BigDecimal b) { s.setTotalExpenses(b); return this; }
        public DashboardSummaryBuilder netBalance(BigDecimal b) { s.setNetBalance(b); return this; }
        public DashboardSummaryBuilder pendingClearances(long n) { s.setPendingClearances(n); return this; }
        public DashboardSummary build() { return s; }
    }

    public static DashboardSummaryBuilder builder() {
        return new DashboardSummaryBuilder();
    }
}
