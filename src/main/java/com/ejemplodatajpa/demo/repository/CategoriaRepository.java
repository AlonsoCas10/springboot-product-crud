package com.ejemplodatajpa.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ejemplodatajpa.demo.model.Categoria;



public interface CategoriaRepository
        extends JpaRepository<Categoria, Long> {
}