package com.library.controller;

import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookRepository bookRepository;

    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // GET all books - Admin & Staff
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // GET book by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET search books by title or author
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<Book> searchBooks(@RequestParam String keyword) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(keyword, keyword);
    }

    // POST create book - Admin & Staff
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book saved = bookRepository.save(book);
        return ResponseEntity.ok(saved);
    }

    // PUT update book - Admin & Staff
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookData) {
        return bookRepository.findById(id).map(book -> {
            book.setTitle(bookData.getTitle());
            book.setAuthor(bookData.getAuthor());
            book.setCategory(bookData.getCategory());
            book.setIsbn(bookData.getIsbn());
            book.setPublisher(bookData.getPublisher());
            book.setPublishedYear(bookData.getPublishedYear());
            book.setTotalQuantity(bookData.getTotalQuantity());
            book.setAvailableQuantity(bookData.getAvailableQuantity());
            return ResponseEntity.ok(bookRepository.save(book));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE book - Admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.ok("Book deleted successfully");
    }
}
