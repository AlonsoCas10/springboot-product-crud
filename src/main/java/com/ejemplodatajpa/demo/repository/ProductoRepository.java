package com.ejemplodatajpa.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ejemplodatajpa.demo.model.Producto;


public interface ProductoRepository extends JpaRepository<Producto, Long> {

}