package com.library.repository;

import com.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByCategoryIgnoreCase(String category);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByAvailableQuantityGreaterThan(int qty);
    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author);


    @Query("SELECT b FROM Book b WHERE b.availableQuantity > 0")
    List<Book> findAvailableBooks();
}
