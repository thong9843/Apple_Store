package com.example.apple_store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.apple_store.entity.*;

public interface CategoryRepository extends JpaRepository<Category, Long> {}