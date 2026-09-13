package com.ejemplodatajpa.demo.controller;

import com.ejemplodatajpa.demo.model.Producto;
import com.ejemplodatajpa.demo.repository.ProductoRepository;
import com.ejemplodatajpa.demo.repository.CategoriaRepository;
import org.springframework.web.bind.annotation.*;

import com.ejemplodatajpa.demo.model.Categoria;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoRepository repo;
    private final CategoriaRepository categoriaRepository;

    // Inyección del Repository
    public ProductoController(ProductoRepository repo, CategoriaRepository categoriaRepository) {
        this.repo = repo;
        this.categoriaRepository = categoriaRepository;
    }

    // =========================
    // CREAR
    // =========================
    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        
        Categoria categoria =
            categoriaRepository.findById(
                producto.getCategoria().getId()
            ).orElseThrow(()->
                new RuntimeException(
                        "Categoria no encontrada"
                )
            );
        
        producto.setCategoria(categoria);
        return repo.save(producto);
            
    }

    // =========================
    // LISTAR
    // =========================
    @GetMapping
    public List<Producto> listar() {
        return repo.findAll();
    }

    // =========================
    // BUSCAR POR ID
    // =========================
    @GetMapping("/{id}")
    public Producto buscar(@PathVariable Long id) {

        return repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Producto no encontrado"));
    }

    // =========================
    // EDITAR
    // =========================
    @PutMapping("/{id}")
    public Producto actualizar(
            @PathVariable Long id,
            @RequestBody Producto producto) {

        Producto productoExistente = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Producto no encontrado"));
         
        System.out.println(
        "CATEGORIA RECIBIDA: " +
        producto.getCategoria().getId()
);
        

        productoExistente.setNombre(producto.getNombre());
        productoExistente.setPrecio(producto.getPrecio());

            // BUSCAR LA CATEGORÍA
    Categoria categoria =
            categoriaRepository.findById(
                    producto.getCategoria().getId()
            ).orElseThrow(() ->
                    new RuntimeException(
                            "Categoria no encontrada"
                    )
            );


    // ASIGNAR LA CATEGORÍA
    productoExistente.setCategoria(
            categoria
    );



        return repo.save(productoExistente);
    }

    // =========================
    // ELIMINAR
    // =========================
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {

        repo.deleteById(id);
    }
}