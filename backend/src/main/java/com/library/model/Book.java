package com.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String author;
    private String category;

    @Column(unique = true)
    private String isbn;

    private String publisher;
    private Integer publishedYear;

    private Integer totalQuantity = 1;
    private Integer availableQuantity = 1;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Book() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public Integer getPublishedYear() { return publishedYear; }
    public void setPublishedYear(Integer publishedYear) { this.publishedYear = publishedYear; }
    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }
    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class BookBuilder {
        private final Book book = new Book();
        public BookBuilder id(Long id) { book.setId(id); return this; }
        public BookBuilder title(String title) { book.setTitle(title); return this; }
        public BookBuilder author(String author) { book.setAuthor(author); return this; }
        public BookBuilder category(String category) { book.setCategory(category); return this; }
        public BookBuilder isbn(String isbn) { book.setIsbn(isbn); return this; }
        public BookBuilder publisher(String publisher) { book.setPublisher(publisher); return this; }
        public BookBuilder publishedYear(Integer year) { book.setPublishedYear(year); return this; }
        public BookBuilder totalQuantity(Integer qty) { book.setTotalQuantity(qty); return this; }
        public BookBuilder availableQuantity(Integer qty) { book.setAvailableQuantity(qty); return this; }
        public Book build() { return book; }
    }

    public static BookBuilder builder() {
        return new BookBuilder();
    }
}
